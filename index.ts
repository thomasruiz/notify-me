import {config} from './config';
import {runNotification} from './notifications';
import {askWhatToDo} from './ask-what-to-do';

config.notifications.forEach(notification => runNotification(notification));
askWhatToDo();
