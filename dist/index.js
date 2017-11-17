"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var notifications_1 = require("./notifications");
var ask_what_to_do_1 = require("./ask-what-to-do");
config_1.config.notifications.forEach(function (notification) { return notifications_1.runNotification(notification); });
ask_what_to_do_1.askWhatToDo();
