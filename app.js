const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const config = require('./config/config.json')

const app = express();

const User = require('./classes/User');

const SendService = require('./services/sendService');
const sendService = new SendService();

const MessageService = require('./services/messageService');
const messageService = new MessageService();
messageService.message$.subscribe( message => {

    if (message.text.toLowerCase() === 'commands') {
        const to = message.chat.id;
        const text = `
### Commands
- commands
- hello world
`;

        sendService.send(text,to,{parse_mode: 'Markdown'});
    } else if (message.text.toLowerCase() === 'hello world') {
        console.log('*Hello world!*')
    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
