import * as inquirer from "inquirer";
import {addNotification, resetNotifications} from "./notifications";

export const askWhatToDo = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            choices: ['Add a notification', 'Reset notifications', 'Do nothing'],
            message: 'What do you want to do?'
        }
    ]).then(answers => {
        switch (answers.action) {
            case 'Add a notification':
                addNotification();
                break;
            case 'Reset notifications':
                resetNotifications();
                break;
            case 'Do nothing':
                console.info('Hit ^C to exit the app. Have a nice day!');
        }
    })
};