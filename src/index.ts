import { app, BrowserWindow } from 'electron';
declare var MAIN_WINDOW_WEBPACK_ENTRY: any;
import * as config_menu from './ui/appMenu/mainMenu';
import * as path from 'path';


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

//Load menu from template
config_menu.setup();

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, './static/favicon.ico'),
    width: 1800,
    height: 1500,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      // should disable nodeIntegration, but something with tsconfig and commonjs doesn't allow for this.
      // nodeIntegrationInWorker: true,
      worldSafeExecuteJavaScript: true,
      nodeIntegration: true,
      preload: './ui/preload.ts'

    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
