'use strict';
const electron = require("electron");
const fs = require("fs");
const uuid = require("uuid");

const {app, BrowserWindow, Menu, ipcMain} = electron;

let newForm;
let adminListRenewal;
let facecamWindow;
let adminListNew;
let renewalForm;
let waitingRenewalList;
let waitingNewList;
let allNewVisa=[];

fs.readFile("db_new.json", (err, jsonVisas) => {
    if (!err) {
        const oldNewVisas = JSON.parse(jsonVisas);
        allNewVisa = oldNewVisas;
    }
});

app.on("ready", () => {
    adminListNew = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
    },
    title: "Visa Online"
    });
    adminListNew.loadURL(`file://${__dirname}/list_newVisa.html`);
    
    adminListNew.on("closed", () => {
    const jsonNewVisas = JSON.stringify(allNewVisa);
    fs.writeFileSync("db_new.json", jsonNewVisas);
    app.quit();
    adminListNew = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const adminListRenewalCreator =()=>{  
    adminListRenewal = new BrowserWindow({
    webPreferences: {
        nodeIntegration: true
    },
    width: 600,
    height: 400,
    title: "Status renewal Visa"
});
    adminListRenewal.loadURL(`file://${__dirname}/list_renewalVisa.html`);
    adminListRenewal.setMenu(null);
    adminListRenewal.on("closed", () => (adminListRenewal = null));

};
   
const facecamCreator = () => {
    facecamWindow = new BrowserWindow({
        useContentSize: true,
        width: 600,
        height: 400,
        resizable: false,
        fullscreen: false,
        title: "Photo Registration"
    });
    
    facecamWindow.setMenu(null);
    facecamWindow.loadURL(`file://${__dirname}/facecam.html`);
    facecamWindow.on("closed", () => (facecamWindow = null));
};

const renewalFormCreator = () => {
    renewalForm = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Registration Renewal Visa"
    });
    
    renewalForm.setMenu(null);
    renewalForm.loadURL(`file://${__dirname}/renewal_form.html`);
    renewalForm.on("closed", () => (renewalForm = null));
};

const waitingRenewalListCreator = () => {
    waitingRenewalList = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Registration Renewal Visa"
    });
    
    waitingRenewalList.setMenu(null);
    waitingRenewalList.loadURL(`file://${__dirname}/waiting_listRenewal.html`);
    waitingRenewalList.on("closed", () => (waitingRenewalList = null));
};

const newFormCreator = () => {
    newForm = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Registration New Visa"
    });
    
    newForm.setMenu(null);
    newForm.loadURL(`file://${__dirname}/form_new.html`);
    newForm.on("closed", () => (newForm = null));
};

const waitingNewListCreator = () => {
    waitingNewList = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Registration New Visa"
    });
    
    waitingNewList.setMenu(null);
    waitingNewList.loadURL(`file://${__dirname}/waiting_listNew.html`);
    waitingNewList.on("closed", () => (waitingNewList = null));
};

ipcMain.on("visa:new:information", (event, visa) => {
    visa["id"] = uuid();
    visa["done"] = 0;
    allNewVisa.push(visa);
    
    sendAllNewVisas();
    facecamCreator();
    newForm.close();
});

ipcMain.on("visa:new:request:list", event => {
    adminListNew.webContents.send("visa:new:response:list",
    allNewVisa);
});

ipcMain.on("visa:new:request:list", event => {
    waitingNewList.webContents.send("visa:new:response:list",
    allNewVisa);
});

ipcMain.on("visa:new:request:type", event => {
    sendAllNewVisas();
});

ipcMain.on("visa:new:done", (event, id) => {
    allNewVisa.forEach( visa => {
        if (visa.id === id) visa.done = 1;
    });
    sendAllNewVisas();
});


const sendAllNewVisas = () => {
    const today = new Date().toISOString().slice(0,10);
    const filtered = allNewVisa.filter(
        visa => visa.type === today
    );
    adminListNew.webContents.send("visa:new:response:type", filtered);
};

const menuTemplate = [
    {
    label: "Visa online",
    submenu: [
        {
            label: "New Visa",
            click() {
            newFormCreator();
            }
        },
        {
            label: "Renewal Visa",
            click() {
            renewalFormCreator();
            }
        },
        {
            label: "Renewal Status Visa",
            click() {
            adminListRenewalCreator();
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
        label: "Admin Files",
        submenu: [
            {
                label: "All New waiting list",
                click() {
                waitingNewListCreator();
                }
            },
            {
                label: "All Renewal waiting list",
                click() {
                waitingRenewalListCreator();
                }
            }
        ]
        },
    {
        label: "View",
        submenu: [{ role: "reload" }, {role: "toggledevtools" }]

            }
        
];