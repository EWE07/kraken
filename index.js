require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development'

const token = isDev ? process.env.TOKEN_DEV : process.env.TOKEN
const prefix = isDev ? "$" : "!"

const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({
    allowedMentions: {
        repliedUser: true
    }
});

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.login(token);

client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
    if(isDev) {
        console.info(`DEV MODE ON`)
    }
});

client.on('message', msg => {
    if(msg.mentions.roles.has('819028004880515073') || msg.mentions.roles.has('875854854680100914')) {
        sendSignal(msg)
    }

    if(!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    const alphanumeric = '^[a-z0-9]+$';

    if(!cmd.match(alphanumeric)) return;

    try {
        client.commands.get(cmd).execute(msg, args, client);
    } catch (error) {
        console.error(error);
        msg.reply('There was an error trying to execute that command!');
    }
});

function sendSignal(msg) {
    options = {}

    if(msg.mentions.roles.has('819028004880515073')) {
        options['files'] = ['./images/val.png']
    } else {
        options['files'] = ['./images/aram.png']
    }

    msg.reply(options)
}