import { BrowserView, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import _ from 'lodash';
import path from 'path';
import ConstantUtil from './util/ConstantUtil';

const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 1212;
const baseUrl = isDevelopment ? `http://localhost:${port}#` : `file://${path.resolve(__dirname, '../renderer', 'index.html')}#`;

export default class BrowserViewManager {
    static viewHolder: Map<number, BrowserView> = new Map<number, BrowserView>();
    static useDarkTheme = false;

    static mainWin: BrowserWindow;

    static addOrFocus(connectionId: number) {
        let view = this.viewHolder.get(connectionId);
        if (_.isNil(view)) {
            view = new BrowserView({
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false,
                    defaultEncoding: 'utf8'
                }
            });
            this.viewHolder.set(connectionId, view);
            view.webContents.loadURL(this.buildConnectionPanelPath(connectionId));
            // view.webContents.send(ConstantUtil.ActionChennel.CHANGE_THEME, this.useDarkTheme);
        }
        this.forcus(connectionId);
        if (isDebug) {
            view.webContents.openDevTools({mode: 'undocked'});
        }
    }

    static forcus(connectionId: number) {
        const view = this.viewHolder.get(connectionId);
        if (_.isNil(view)) {
            return;
        }
        this.mainWin.setBrowserView(view);
        view.setAutoResize({width: true, height: true, horizontal: false, vertical: false});
        const bounds = this.mainWin.getBounds();
        view.setBounds({x: 280, y: 0, width: bounds.width - 280, height: bounds.height});
    }

    static remove(connectionId: number) {
        const view = this.viewHolder.get(connectionId);
        if (view == null) {
            return 0;
        }
        if (this.mainWin.getBrowserView() === view) {
            if (this.viewHolder.size > 1) {
                // eslint-disable-next-line no-restricted-syntax
                for (const k of this.viewHolder.keys()) {
                    const v = this.viewHolder.get(k) as BrowserView;
                    if (v !== view) {
                        this.mainWin.webContents.send(ConstantUtil.BVIpcChannel.FOCUS, k)
                        this.mainWin.setBrowserView(v);
                        this.viewHolder.delete(connectionId);
                        return k;
                    }
                }
            }
        }
        this.mainWin.webContents.send(ConstantUtil.BVIpcChannel.FOCUS, 0);
        this.viewHolder.delete(connectionId);
        this.mainWin.setBrowserView(null);
        return 0;
    }

    static buildNormalPath(pathName: string) {
        return `${baseUrl}?pathName=${pathName}`;
    }

    static buildConnectionPanelPath(connectionId: number) {
        return `${baseUrl}?pathName=${ConstantUtil.PathName.PANEL}&connectionId=${connectionId}`;
    }

    static listening() {
        ipcMain.on(ConstantUtil.BVIpcChannel.ADD_OR_FOUCUS, (event, connectionId: number) => {
            this.addOrFocus(connectionId);
        });
        ipcMain.handle(ConstantUtil.BVIpcChannel.REMOVE, (event, connectionId: number) => {
            return this.remove(connectionId);
        });
        ipcMain.handle(ConstantUtil.ActionChennel.GET_CURRENT_THEME, e => {
            return this.useDarkTheme;
        })
    }
}
