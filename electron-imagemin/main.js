const electron = require('electron');
const { app,BrowserWindow,Menu,MenuItem,Tray } = electron;

let mainWindow;

function createWindow(){
  mainWindow = new BrowserWindow({
    width:400,
    height:400,
    icon:__dirname+'/app/favicon.ico',
    resizable: false
  });
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
  
  //mainWindow.webContents.openDevTools();

  const menu = new Menu();
  menu.append(new MenuItem({
    label: '设置',
    submenu: [
      {
        label: '替换原图(功能还未实现)',
        type: 'checkbox'
      }
    ]
  }));

  Menu.setApplicationMenu(menu);

  mainWindow.on('closed',()=>{
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed',()=>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate',()=>{
  if(mainWindow === null){
    createWindow();
  }
});
