import {homedir} from 'os';
import * as fs from 'fs';

export const configPath = `${homedir()}/.notifyme.json`;

let cnf;
try {
    cnf = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
    cnf = {notifications: []};
}

export const config = cnf;
