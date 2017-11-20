"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer = require("inquirer");
var notifications_1 = require("./notifications");
exports.askWhatToDo = function () {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            choices: ['List notifications', 'Add a notification', 'Remove a notification', 'Reset notifications', 'Do nothing'],
            message: 'What do you want to do?'
        }
    ]).then(function (answers) {
        switch (answers.action) {
            case 'Add a notification':
                notifications_1.addNotification();
                break;
            case 'Reset notifications':
                notifications_1.resetNotifications();
                break;
            case 'List notifications':
                notifications_1.listNotifications();
                break;
            case 'Remove a notification':
                notifications_1.removeNotification();
                break;
            case 'Do nothing':
                console.info('Hit ^C to exit the app. Have a nice day!');
        }
    });
};
