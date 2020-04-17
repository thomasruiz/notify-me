import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as notifier from 'node-notifier';
import * as uuidv4 from 'uuid/v4';
import {askWhatToDo} from './ask-what-to-do';
import {config, configPath} from './config';

const runningNotifications = {};

export const syncNotifications = () => {
    fs.writeFileSync(configPath, JSON.stringify(config));
};

export const runNotification = (notification) => {
    console.info('Notification is running: ' + notification.content.title);
    runningNotifications[notification.id] = setInterval(() => {
        console.info('Running notification: ' + notification.title);
        notifier.notify(notification.content, function (err, resp) {
            if (err) {
                console.error(err);
            }
        });
    }, notification.delay * 1000);
};

export const listNotifications = () => {
    config.notifications.forEach((notification) => {
        console.info(notification.content.title + ' is running every ' + (notification.delay / 60) + ' minutes.');
        console.info(notification.content.message + '\n');
    });

    askWhatToDo();
};

export const removeNotification = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'notification',
            choices: config.notifications.map((notification) => notification.content.title),
            message: 'What do you want to do?'
        }
    ]).then((answers) => {
        const foundNotification = config.notifications.find((notification) => {
            return notification.content.title === answers.notification;
        });

        stopNotification(foundNotification.id);

        config.notifications = config.notifications.filter((notification) => {
            return foundNotification.id !== notification.id
        });

        syncNotifications();

        console.log(`Notification ${foundNotification.content.title} has been removed.`);

        askWhatToDo();
    });
};

export const addNotification = () => {
    const questions = [
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
            validate(value) {
                const valid = !isNaN(parseFloat(value));
                return valid || 'Please enter a number';
            },
            filter: Number as any,
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        const notification = {
            id: uuidv4(),
            delay: parseInt(answers.delay, 10) * 60,
            content: {
                title: answers.title,
                message: answers.content,
                sound: answers.sound,
            },
        };

        config.notifications.push(notification);
        runNotification(notification);
        syncNotifications();
        askWhatToDo();
    });
};

export const stopNotification = (notificationId) => {
    clearInterval(runningNotifications[notificationId]);

    const notification = config.notifications.find((notification) => notification.id == notificationId);

    console.log(`Notification ${notification.content.title} has been stopped.`);
};

export const stopNotifications = () => {
    Object.keys(runningNotifications).forEach((_, id) => stopNotification(id));
};

export const resetNotifications = () => {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: 'This will delete all your configuration. Are you sure?',
            default: false,
        }
    ]).then((answers) => {
        if (answers.confirm) {
            stopNotifications();
            config.notifications = [];

            console.info('Your notifications have been cleaned.');

            syncNotifications();
        }

        askWhatToDo();
    })
};
