'use strict';
const electron = require("electron");
const fs = require("fs");
const uuid = require("uuid");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let login;
let newForm;
let renewalForm;
let adminList;

let renewalUsers=[];
let newUsers=[];

//Database
fs.readFile("db.json", (err, jsonVisas) => {
    if (!err) {
        const oldVisas = JSON.parse(jsonVisas);
        allVisas = oldVisas;
    }
});

app.on("ready", () => {
    login = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
    },
    title: "Visa Online"
    });
    login.loadURL(`file://${__dirname}/html/login.html`);
    adminList.loadURL(`file://${__dirname}/html/db.html`);
    //dbs
    adminList.on("closed", () => {
    const jsonVisas = JSON.stringify(allVisas);
    fs.writeFileSync("db.json", jsonVisas);
    app.quit();
    adminList = null;
    });
   
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

//Create a new window and show the file where a new appointment can be made
const newFormCreator = () => {
    newForm = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Registration Visa"
    });
    
    newForm.setMenu(null);
    newForm.loadURL(`file://${__dirname}/html/form_new.html`);
    newForm.on("closed", () => (newForm = null));
};

const renewalFormCreator = () => {
    renewalForm = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Registration Visa"
    });
    
    renewalForm.setMenu(null);
    renewalForm.loadURL(`file://${__dirname}/html/renewal_form.html`);
    renewalForm.on("closed", () => (renewalForm = null));
};
//Create a new window and show the file where is all the appointments
const adminListCreator = () => {
    adminList = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Registration Visa for new and renewal users"
    });
    
    adminList.setMenu(null);
    adminList.loadURL(`file://${__dirname}/html/db.html`);
    adminList.on("closed", () => (adminList = null));
};

//Display new visas
ipcMain.on("visa:newUser:information", (event, newUser) => {
    newUser["id"] = uuid();
    newUser["done"] = 0;
    allVisas.push(newUser);
    
    sendAllVisas();
    newForm.close();
});

//Display renewal visas
ipcMain.on("visa:renewalUser:information", (event, renewalUser) => {
    renewalUser["id"] = uuid();
    renewalUser["done"] = 0;
    allVisas.push(renewalUser);
    
    sendAllVisas();
    renewalForm.close();
});


ipcMain.on("visa:newUser&renewalUser:list", event => {
    adminList.webContents.send("visa:newUser&renewalUser:list",
    allVisas);
});

ipcMain.on("visa:request:type", event => {
    sendAllVisas();
});

ipcMain.on("visa:done", (event, id) => {
    allVisas.forEach( visa => {
        if (visa.id === id) visa.done = 1;
    });
    sendAllVisas();
});
//Modify this part filtered type of visa
const sendAllVisas = () => {
    const today = new Date().toISOString().slice(0, 10);
    const filtered = allAppointments.filter(
        appointment => appointment.date === today
    );
    todayWindow.webContents.send("appointment:response:today", filtered);
};

//Create the menu bar in the application
const menuTemplate = [
    {
    label: "File",
    submenu: [
        {
            label: "New Appointment",
            click() {
            newFormCreator();
            }
        },
        {
            label: "New Visa",
            click() {
            listWindowCreator();
            }
        },
        {
            label: "Renewal Visa",
            click() {
            renewalFormCreator();
            }
        },
        {
            label: "Quit",
            accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
            click() {
                app.quit();
            }
        }
    ]
    },
    {
        label: "View",
        submenu: [{ role: "reload" }, { role: "toggledevtools" }]
    }
];