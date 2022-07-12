/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import MenuBuilder from './menu';
import BrowserViewManager from './BrowserViewManager';
import ConstantUtil from './util/ConstantUtil';
import LocalStorage from './storage/LocalStorage';

let mainWindow: BrowserWindow | null = null;

// ipcMain.on('ipc-example', async (event, arg) => {
//     const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
//     console.log(msgTemplate(arg));
//     event.reply('ipc-example', msgTemplate('pong'));
// });

if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
}

const isDebug =
    process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

// if (isDebug) {
    // require('electron-debug')();
// }

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS'];

    return installer
        .default(
            extensions.map((name) => installer[name]),
            forceDownload
        )
        .catch(console.log);
};

const createWindow = async () => {
    // if (isDebug) {
    //     await installExtensions();
    // }

    const RESOURCES_PATH = app.isPackaged
        ? path.join(process.resourcesPath, 'assets')
        : path.join(__dirname, '../../assets');

    const getAssetPath = (...paths: string[]): string => {
        return path.join(RESOURCES_PATH, ...paths);
    };

    mainWindow = new BrowserWindow({
        show: false,
        width: 1024,
        height: 728,
        icon: getAssetPath('icon.png'),
        webPreferences: {
            preload: app.isPackaged
                ? path.join(__dirname, 'preload.js')
                : path.join(__dirname, '../../.erb/dll/preload.js'),
            contextIsolation: false,
            nodeIntegration: true,
            defaultEncoding: 'utf8'
        },
    });

    BrowserViewManager.mainWin = mainWindow;

    mainWindow.loadURL(BrowserViewManager.buildNormalPath(ConstantUtil.PathName.MAIN));

    mainWindow.on('ready-to-show', () => {
        if (!mainWindow) {
            throw new Error('"mainWindow" is not defined');
        }
        if (process.env.START_MINIMIZED) {
            mainWindow.minimize();
        } else {
            mainWindow.show();
        }
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();

    // Open urls in the user's browser
    mainWindow.webContents.setWindowOpenHandler((edata) => {
        shell.openExternal(edata.url);
        return { action: 'deny' };
    });

    LocalStorage.listenConnectionChannel(mainWindow);
    ipcMain.on(ConstantUtil.ActionChennel.CLOSE_ADD_CONNECTION_WIN, e => {
        if (menuBuilder.addConnectionWin != null) {
            menuBuilder.addConnectionWin.close();
        }
    })
    ipcMain.on(ConstantUtil.ActionChennel.CHANGE_THEME, (e, useDark: boolean) => {
        mainWindow?.webContents.send(ConstantUtil.ActionChennel.CHANGE_THEME, useDark);
        BrowserViewManager.useDarkTheme = useDark;
        BrowserViewManager.viewHolder.forEach(view => {
            view.webContents.send(ConstantUtil.ActionChennel.CHANGE_THEME, useDark);
        });
    });

    if (isDebug) {
        mainWindow.webContents.openDevTools();
    }
    // BrowserViewManager.addOrFocus(124);
};


/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.whenReady()
    .then(() => {
        createWindow();
        BrowserViewManager.listening();
        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow === null) createWindow();
        });
    })
    .catch(console.log);
