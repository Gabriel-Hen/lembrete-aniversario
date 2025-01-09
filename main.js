const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Caminho para o arquivo JSON
const dataFilePath = path.join(__dirname, 'src', 'data', 'data.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Carrega o preload.js
    },
  });

  win.loadFile(path.join(__dirname, 'src', 'views', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC para leitura do arquivo JSON
ipcMain.handle('read-data', async () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erro ao ler o arquivo:', err);
    return [];
  }
});

// IPC para adicionar dados no JSON
ipcMain.handle('add-data', async (event, newData) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    data.push(newData); // Adiciona novo dado
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error('Erro ao salvar os dados:', err);
    return false;
  }
});

ipcMain.handle('overwrite-data', async (event, newData) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2));
    return true;
  } catch (err) {
    console.error('Erro ao salvar os dados:', err);
    return false;
  }
})
