const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
      webSecurity: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
  }

  // Handle external navigation to localhost
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.includes('localhost')) {
      event.preventDefault();
      if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
      } else {
        mainWindow.loadFile(path.join(__dirname, 'build', 'index.html'));
      }
    }
  });

  // Define the custom menu template
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { label: 'New', click: () => { console.log('New file'); } },
        { label: 'Open', click: () => { console.log('Open file'); } },
        { type: 'separator' },
        { label: 'Exit', role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', role: 'undo' },
        { label: 'Redo', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', role: 'cut' },
        { label: 'Copy', role: 'copy' },
        { label: 'Paste', role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', role: 'reload' },
        { label: 'Toggle Full Screen', role: 'togglefullscreen' },
        { label: 'Developer Tools', role: 'toggleDevTools' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        { label: 'Learn More', click: () => { require('electron').shell.openExternal('https://electronjs.org') } }
      ]
    }
  ];

  // Create the menu from the template and set it as the application menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});