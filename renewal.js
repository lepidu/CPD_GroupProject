'use strict';
const electron = require("electron");
const fs = require("fs");
const uuid = require("uuid");

const {ipcMain} = electron;

let renewalForm;
let adminListRenewal;
let allRenewalVisa=[];

function saveInfo (save) {
    if (save){
    fs.readFile("db_renewal.json", (err, jsonVisas) => {
    if (!err) {
      const oldRenewalVisas = JSON.parse(jsonVisas);
        allRenewalVisa = oldRenewalVisas;
   }
 });
    adminListRenewal.on("closed", () => {
    const jsonRenewalVisas = JSON.stringify(allRenewalVisa);
    fs.writeFileSync("db_renewal.json", jsonRenewalVisas);
    adminListRenewal = null;
    });
}
}

ipcMain.on("visa:renewal:information", (event, visa) => {
    visa["id"] = uuid();
    visa["done"] = 0;
    allRenewalVisa.push(visa);
    
    sendAllRenewalVisas();
    renewalForm.close();
});

ipcMain.on("visa:renewal:request:list", event => {
    adminListRenewal.webContents.send("visa:renewal:response:list",
    allRenewalVisa);
});

ipcMain.on("visa:renewal:request:type", event => {
    sendAllRenewalVisas();
});

ipcMain.on("visa:renewal:done", (event, id) => {
    allRenewalVisa.forEach( visa => {
        if (visa.id === id) visa.done = 1;
    });
    sendAllRenewalVisas();
});

const sendAllRenewalVisas = () => {
    const today = new Date().toISOString().slice(0,10);
    const filtered = allRenewalVisa.filter(
        visa => visa.type === today
    );
    adminListRenewal.webContents.send("visa:renewal:response:type", filtered);
};