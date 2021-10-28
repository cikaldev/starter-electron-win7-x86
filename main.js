const { app, BrowserWindow } = require('electron');
require('./myapp')

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.setMenuBarVisibility(false);
  win.loadURL('http://localhost:1945');
}

app.whenReady().then(createWindow);