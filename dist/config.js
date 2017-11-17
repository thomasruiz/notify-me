"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var fs = require("fs");
exports.configPath = os_1.homedir() + "/.notifyme.json";
var cnf;
try {
    cnf = JSON.parse(fs.readFileSync(exports.configPath, 'utf8'));
}
catch (e) {
    cnf = { notifications: [] };
}
exports.config = cnf;
