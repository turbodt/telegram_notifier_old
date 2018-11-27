const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const config = require('./config/config.json');

const { exec } = require('child_process');
const { spawn } = require('child_process');

const app = express();

const User = require('./classes/User');

const SendService = require('./services/sendService');
const sendService = new SendService();

const MessageService = require('./services/messageService');
const messageService = new MessageService();
messageService.message$.subscribe( message => {

    if (message.chat !== null) {
        console.log(message.chat.id, message.chat.type);
    }
    console.log(message.text);
    console.log(message.from);


    if (message.text === null) {
        //
    } else if (message.text.toLowerCase() === 'commands') {
        const to = message.chat.id;
        const text = `
### Commands
- commands
- hello world
- deploy dev
`;

        sendService.send(text,to,{parse_mode: 'Markdown'});

    } else if (message.text.toLowerCase() === 'hello world') {
        console.log('*Hello world!*');
        sendService.send(`"Hello world!" has been printed in all current instances.`, message.chat.id);

    } else if (message.text.toLowerCase() === 'deploy dev') {

        let stdout = '';
        let stderr = '';

        const command = spawn('sh',['./scripts/deploy_dev.sh', config['paths']['home'], config['paths']['sailbs_repo'], config['paths']['sailbs_doc']]);

        command.stdout.on('data', function (data) {
            console.log(data.toString());
            sendService.send(data.toString(),message.chat.id);
            stdout += data.toString();
        });

        command.stderr.on('data', function (data) {
            console.log(data.toString());
            sendService.send(data.toString(),message.chat.id);
            stderr += data.toString();
        });

        command.on('close', function (code) {
            console.log(`child process exited with code ${code}`);
        });


    }
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

module.exports = app;
