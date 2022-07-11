import {
    app,
    Menu,
    shell,
    BrowserWindow,
    MenuItemConstructorOptions,
} from 'electron';
import path from 'path';
import BrowserViewManager from './BrowserViewManager';
import ConstantUtil from './util/ConstantUtil';


export default class MenuBuilder {
    mainWindow: BrowserWindow;
    addConnectionWin: BrowserWindow | null = null;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    buildMenu(): Menu {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
        ) {
            this.setupDevelopmentEnvironment();
        }

        const template = this.buildDefaultTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    setupDevelopmentEnvironment(): void {
        this.mainWindow.webContents.on('context-menu', (_, props) => {
            const { x, y } = props;

            Menu.buildFromTemplate([
                {
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.webContents.inspectElement(x, y);
                    },
                },
            ]).popup({ window: this.mainWindow });
        });
    }

    buildDefaultTemplate() {
        const templateDefault = [
            {
                label: '&File',
                submenu: [
                    {
                        label: '&Open',
                        accelerator: 'Ctrl+O',
                    },
                    {
                        label: '&Close',
                        accelerator: 'Ctrl+W',
                        click: () => {
                            this.mainWindow.close();
                        },
                    },
                    {
                        label: '&New Connection',
                        accelerator: 'Ctrl+N',
                        click: () => {
                            this.createAddConnectionWindow()
                        },
                    }
                ],
            },
            {
                label: '&View',
                submenu:
                    process.env.NODE_ENV === 'development' ||
                    process.env.DEBUG_PROD === 'true'
                        ? [
                              {
                                  label: '&Reload',
                                  accelerator: 'Ctrl+R',
                                  click: () => {
                                      this.mainWindow.webContents.reload();
                                  },
                              },
                              {
                                  label: 'Toggle &Full Screen',
                                  accelerator: 'F11',
                                  click: () => {
                                      this.mainWindow.setFullScreen(
                                          !this.mainWindow.isFullScreen()
                                      );
                                  },
                              },
                              {
                                  label: 'Toggle &Developer Tools',
                                  accelerator: 'Alt+Ctrl+I',
                                  click: () => {
                                      this.mainWindow.webContents.toggleDevTools();
                                  },
                              },
                          ]
                        : [
                              {
                                  label: 'Toggle &Full Screen',
                                  accelerator: 'F11',
                                  click: () => {
                                      this.mainWindow.setFullScreen(
                                          !this.mainWindow.isFullScreen()
                                      );
                                  },
                              },
                          ],
            },
            {
                label: 'Help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() {
                            shell.openExternal('https://electronjs.org');
                        },
                    },
                    {
                        label: 'Documentation',
                        click() {
                            shell.openExternal(
                                'https://github.com/electron/electron/tree/main/docs#readme'
                            );
                        },
                    },
                    {
                        label: 'Community Discussions',
                        click() {
                            shell.openExternal(
                                'https://www.electronjs.org/community'
                            );
                        },
                    },
                    {
                        label: 'Search Issues',
                        click() {
                            shell.openExternal(
                                'https://github.com/electron/electron/issues'
                            );
                        },
                    },
                ],
            },
        ];

        return templateDefault;
    }

    createAddConnectionWindow()  {
        const RESOURCES_PATH = app.isPackaged
            ? path.join(process.resourcesPath, 'assets')
            : path.join(__dirname, '../../assets');

        const getAssetPath = (...paths: string[]): string => {
            return path.join(RESOURCES_PATH, ...paths);
        };

        this.addConnectionWin = new BrowserWindow({
            show: false,
            width: 600,
            height: 400,
            icon: getAssetPath('icon.png'),
            parent: this.mainWindow,
            modal: true,
            webPreferences: {
                preload: app.isPackaged
                    ? path.join(__dirname, 'preload.js')
                    : path.join(__dirname, '../../.erb/dll/preload.js'),
                contextIsolation: false,
                nodeIntegration: true,
                defaultEncoding: 'utf8',

            },
        });

        this.addConnectionWin.setMenu(null);
        this.addConnectionWin.loadURL(BrowserViewManager.buildNormalPath(ConstantUtil.PathName.ADD_CONNECTION));

        this.addConnectionWin.on('ready-to-show', () => {
            if (!this.addConnectionWin) {
                throw new Error('"add connection window" is not defined');
            }
            if (process.env.START_MINIMIZED) {
                this.addConnectionWin.minimize();
            } else {
                this.addConnectionWin.show();
            }
        });

        this.addConnectionWin.on('closed', () => {
            this.addConnectionWin = null;
        });
    }
}
