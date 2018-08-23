
// https://github.com/electron/electron-quick-start/blob/master/main.js

const electron = require('electron');
const settings = require('electron-settings');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const {ipcMain} = require('electron')

const path = require('path');
const url = require('url');
const fs = require('fs');
const remote  = electron.remote

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

//localStorage.setItem('server_url' , settings.get('data.server_url'));
//localStorage.setItem('ruang' , settings.get('data.ruang'));


function createWindow () {
  // Create the browser window.

  mainWindow = new BrowserWindow({  width: 800,
                                    height: 600 ,
                                    show: false ,
                                    //frame: false ,
                                    icon: path.join(__dirname, 'icon.png')})


  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../www/index.html'),
    protocol: 'file:',
    slashes: true
  });


  mainWindow.loadURL(startUrl);
  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')

  mainWindow.on('close', (e) => {

      let jumlah = settings.get('order.count');
      if(jumlah == null) jumlah = 0 ;
      console.log(jumlah);
      if(jumlah >= 1 ){
        //cek_order();
        var choice = electron.dialog.showMessageBox(
        {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: 'Masih ada order yang belom di bayar, anda yakin ingin keluar dari program ?'
       });

      }else{
        //cek_order();
        var choice = electron.dialog.showMessageBox(
        {
          type: 'question',
          buttons: ['Yes', 'No'],
          title: 'Confirm',
          message: 'Anda Yakin Ingin Keluar ?'
       });

      }


     if(choice == 1){
       e.preventDefault();
     }
  });

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function (event) {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    //console.log(event);
    //return false;
  })

  mainWindow.once('ready-to-show', () => {

    //mainWindow.show();
    mainWindow.maximize();
    mainWindow.webContents.send('setting' , settings.get('data.server_url') ,
                                            settings.get('data.ruang') ,
                                            settings.get('data.print_kasir')  ,
                                            settings.get('data.print_bar')  ,
                                            settings.get('data.print_dapur'));

   });

   settings.set('order', {
     count: 0
   });

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()

  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  return false;
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('print-diam' , (event , print_name  , jumlah ) => {
    console.log(jumlah);
    var i = 0;
    while (i < jumlah) {
      go_print_kasir(print_name , i);
      i++;
    }
});

function go_print_kasir(print_name , i){
  var bosprint = [];
  bosprint[i] = new BrowserWindow({width: 800, height: 600 , show: true})
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/print.html'),
    protocol: 'file:',
    slashes: true
  });

  bosprint[i].loadURL(startUrl);
  bosprint[i].webContents.on('did-finish-load', () => {
      bosprint[i].webContents.print({silent: false , printBackground : false , deviceName : print_name });
      // close window after print order.
      bosprint[i] = null;
      console.log('print windows');
    });


}


ipcMain.on('print-modal' , (event , print_name ) => {
    console.log(print_name);
    //let print = mainWindow.webContents.getPrinters();
    //console.log(print);
    printmodal = new BrowserWindow({width: 800, height: 600 , show: false});
    const startUrl = process.env.ELECTRON_START_URL || url.format({
      pathname: path.join(__dirname, '/print-modal.html'),
      protocol: 'file:',
      slashes: true
    });

    //console.log(startUrl);

    printmodal.loadURL(startUrl);
    printmodal.webContents.on('did-finish-load', () => {

      printmodal.webContents.print({silent: true , printBackground : false , deviceName : print_name });
        // close window after print order.
        printmodal = null;
        console.log('print windows');
      });
});

ipcMain.on('print-diam-dapur' , (event , print_name , order ) => {
  //console.log(order);
  var groups = {};
  for (var i = 0; i < order.length; i++) {
    var groupName = order[i].kategori;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(order[i]);
  }

  new_order = [];
  for (var groupName in groups) {
    new_order.push({nama_kategori: groupName, list: groups[groupName]});
  }
  //console.log(new_order):
  for(var i = 0 ; i < new_order.length ; i++){
    //window.localStorage.setItem('order_dapur' , JSON.stringify(new_order[i]));
    go_print_dapur(print_name , new_order[i] , i);
  }

});

ipcMain.on('print-diam-bar' , (event , print_name , order) => {
  //console.log(order);
  var groups = {};
  for (var i = 0; i < order.length; i++) {
    var groupName = order[i].kategori;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(order[i]);
  }

  new_order = [];
  for (var groupName in groups) {
    new_order.push({nama_kategori: groupName, list: groups[groupName]});
  }

  for(var i = 0 ; i < new_order.length ; i++){
    //window.localStorage.setItem('order_bar' , JSON.stringify(new_order[i]));
    go_print_bar(print_name , new_order[i]);
  }

});

function go_print_bar(print_name , order , i){
  console.log(print_name);
  var bosprintbar = [];
  //let print = mainWindow.webContents.getPrinters();
  //console.log(print);
  bosprintbar[i] = new BrowserWindow({width: 800, height: 600 , show: false})
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/print-bar.html'),
    protocol: 'file:',
    slashes: true
  });
  //console.log(startUrl);

  bosprintbar[i].loadURL(startUrl);
  bosprintbar[i].webContents.on('did-finish-load', () => {
      bosprintbar[i].webContents.send('order_bar', order);
      bosprintbar[i].webContents.print({silent: true , printBackground : false , deviceName : print_name });
      // close window after print order.
      bosprintbar[i] = null;
      console.log('print windows');
    });
}

function go_print_dapur(print_name , order , i){
  console.log(order);
  var bosprintda = [];
  //let print = mainWindow.webContents.getPrinters();
  //console.log(print);
  bosprintda[i] = new BrowserWindow({width: 800, height: 600 , show: false});
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/print-dapur.html'),
    protocol: 'file:',
    slashes: true
  });

  //console.log(startUrl);

  bosprintda[i].loadURL(startUrl);

  bosprintda[i].webContents.on('did-finish-load', () => {
      bosprintda[i].webContents.send('order_dapur', order);
      bosprintda[i].webContents.print({silent: true , printBackground : false , deviceName : print_name });
      // close window after print order.
      bosprintda[i] = null;
      console.log('print windows');
    });
}

ipcMain.on('setting-seve' , (event , server_url , ruang , print , print_bar , print_dapur) => {
  console.log(ruang);
  settings.set('data', {
    server_url: server_url,
    ruang: ruang ,
    print_kasir : print ,
    print_bar : print_bar ,
    print_dapur : print_dapur
  });
});

//set order nilai
ipcMain.on('simpan-order' , (event , jumlah ) => {
  settings.set('order', {
    count: jumlah
  });
  //console.log(jumlah);
});
