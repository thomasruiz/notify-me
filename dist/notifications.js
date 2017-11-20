"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var inquirer = require("inquirer");
var notifier = require("node-notifier");
var uuidv4 = require("uuid/v4");
var ask_what_to_do_1 = require("./ask-what-to-do");
var config_1 = require("./config");
var runningNotifications = {};
exports.syncNotifications = function () {
    fs.writeFileSync(config_1.configPath, JSON.stringify(config_1.config));
};
exports.runNotification = function (notification) {
    console.info('Notification is running: ' + notification.content.title);
    runningNotifications[notification.id] = setInterval(function () {
        notifier.notify(notification.content);
    }, notification.delay * 1000);
};
exports.addNotification = function () {
    var questions = [
        {
            type: 'input',
            name: 'title',
            message: 'Set the title of the notification',
        },
        {
            type: 'input',
            name: 'content',
            message: 'Set the content of the notification',
        },
        {
            type: 'confirm',
            name: 'sound',
            message: 'Should it play a sound? (if available on your system)',
        },
        {
            type: 'input',
            name: 'delay',
            message: 'How many minutes should it take between each notification?',
            validate: function (value) {
                var valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number,
        },
    ];
    inquirer.prompt(questions).then(function (answers) {
        var notification = {
            id: uuidv4(),
            delay: parseInt(answers.delay, 10) * 60,
            content: {
                title: answers.title,
                message: answers.content,
                sound: answers.sound,
            },
        };
        config_1.config.notifications.push(notification);
        exports.runNotification(notification);
        exports.syncNotifications();
        ask_what_to_do_1.askWhatToDo();
    });
};
exports.stopNotification = function (notificationId) {
    clearInterval(runningNotifications[notificationId]);
    var notification = config_1.config.notifications.find(function (notification) { return notification.id == notificationId; });
    console.log("Notification " + notification.content.title + " has been stopped.");
};
exports.stopNotifications = function () {
    Object.keys(runningNotifications).forEach(function (_, id) { return exports.stopNotification(id); });
};
exports.resetNotifications = function () {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'This will delete all your configuration. Are you sure?',
            default: false,
        }
    ]).then(function (answers) {
        if (answers.confirm) {
            exports.stopNotifications();
            config_1.config.notifications = [];
            console.info('Your notifications have been cleaned.');
            exports.syncNotifications();
        }
        ask_what_to_do_1.askWhatToDo();
    });
};
