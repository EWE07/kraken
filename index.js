require('dotenv').config();

require('./ExtendedMessage')

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
    if(message.channel.type === "DM") return
    if(msg.channel.id === "855286466367062026") {
        spoilerize(msg);
        return;
    }

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

const books = {
    1: "Red Rising",
    2: "Golden Son",
    3: "Morning Star",
    4: "Iron Gold",
    5: "Dark Age"
}

function spoilerize(msg) {
    if(msg.author.bot) return;
    
    if(msg.content.toLowerCase().startsWith('spoiler')) {
        const book = msg.content.split(' ')[1];
        const chapter = Number(msg.content.split(' ')[2]);
    
        if(isNaN(chapter) || !Object.keys(books).includes(book) || msg.reference) {
            msg.delete().then(msg => {
                msg.channel.send(`<@${msg.author.id}>, please provide book and chapter numbers with your message.`);
                return;
            });
        }

        let response = `<@${msg.author.id}> (${books[book]} | Chapter ${chapter}) said: || ${msg.content.replace('spoiler ','').substring(4)} ||`;
        msg.delete().then(msg => {
            msg.channel.send(response);
            return;
        });
    }
    
    if(msg.reference) {
        let response = `<@${msg.author.id}> said: || ${msg.content} ||`;
        msg.delete().then(msg => {
            msg.channel.messages.fetch(msg.reference.messageID).then(parentMsg => {
                parentMsg.inlineReply(response);
            })
        })
    } 
}
