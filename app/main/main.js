import electron from 'electron';

const {
    app,
    BrowserWindow,
    ipcMain,
    Notification,
} = electron;

// Modules for React.js

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 1360, height: 800 });

    // Load the index.html of the app.
    // Most examples use __dirname instead of process.cwd().
    // However Webpack, at least by default, injects "" as 
    // the __dirname parameter in the bundled file. So to keep
    // things working both in regular electron usage AND webpack,
    // we have to go with process.cwd() instead of __dirname.
    mainWindow.loadURL('file://' + process.cwd() + '/app/renderer/public/index.html');
    

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    function showNotification(options, renderProcess) {
        if (Notification && Notification.isSupported()) {
            console.log('Triggering notification');
            const notification = new Notification(options);
            notification.show();
            notification.on('show', () => {
              console.log('Showing OS notification via default electron code');
            });
            notification.on('click', e => {
              console.log('OS notification was clicked');
              renderProcess.send('show-alert');
            });
            notification.on('close', e => {
              console.log('OS notification was closed');
            });
            notification.on('action', e => {
              console.info('OS notification action was triggered');
            });
            notification.on('reply', e => {
              console.log('OS notification action was reply');
            });
        }
    }

    ipcMain.on('show-notification', (event, options) => {
        showNotification(options,  event.sender);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});