import { BrowserView, BrowserWindow } from 'electron';
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

    static mainWin: BrowserWindow;

    static addOrFocus(connectionId: number) {
        let view = this.viewHolder.get(connectionId);
        if (_.isNil(view)) {
            view = new BrowserView({
                webPreferences: {
                    nodeIntegration: true,
                }
            });
            this.viewHolder.set(connectionId, view);
            view.webContents.loadURL(this.buildConnectionPanelPath(connectionId));
        }
        this.forcus(connectionId);
        if (isDebug) {
            view.webContents.openDevTools();
        }
    }

    static forcus(connectionId: number) {
        const view = this.viewHolder.get(connectionId);
        if (_.isNil(view)) {
            return;
        }
        this.mainWin.setBrowserView(view);
        view.setAutoResize({width: true, height: true, horizontal: false, vertical: false});
        view.setBounds({x: 280, y: 5, width: 720, height: 723});
    }

    static buildMainPath() {
        return `${baseUrl}?pathName=${ConstantUtil.PathName.MAIN}`;
    }

    static buildConnectionPanelPath(connectionId: number) {
        return `${baseUrl}?pathName=${ConstantUtil.PathName.PANEL}&connectionId=${connectionId}`;
    }
}
