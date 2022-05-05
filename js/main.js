'use strict';

var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;
var os = require('os');
const uuid = require("uuid");
var {dialog} = require('electron');
var mainWindow = null;
var ipc = require('electron').ipcMain;

let newUsers=[];

//Close the app
ipc.on('close-main-window', function() {
    app.quit();
});
 
// Start the window
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        resizable: true,
        height: 600,
        width: 800,
        webPreferences:{
          nodeIntegration:true
        }
    });
 
 
mainWindow.loadURL('file://' + __dirname + '/html/documents_renewal.html');
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
   
});

ipc.on("newUser:document", (event, document) => {
    //document["id"] = uuid(); ---> check 
    newUsers.push(document);
    sendNewUser();
   });

ipc.on("newUser:information", (event, information) => {
    //document["id"] = uuid(); ---> check 
    newUsers.push(information);
    sendNewUser();
   });

    const sendNewUser = () => {
    const filtered = newUsers.filter(
    information => information.surname
    );
   };   