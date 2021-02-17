require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development'

const token = isDev ? process.env.TOKEN_DEV : process.env.TOKEN
const prefix = isDev ? "$" : "!"

const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client();
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

    let data = require('./output.json')
    
    const sortable = Object.fromEntries(
        Object.entries(data).sort(([,a],[,b]) => b-a)
    )
    console.log(sortable)
});

client.on('message', msg => {
    if(!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();

    try {
        client.commands.get(cmd).execute(msg, args, client);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

// async function getEmojiCount() {
//     const tokyo = client.channels.cache.get("272239610992525312");
//     let last_id;
//     let emojiDict = {};

//     const regex = /(<(.*?)>)/gm

//     while(true) {
//         let options = { limit: 100 };

//         if(last_id) {
//             options.before = last_id;
//         }

//         const messages = await tokyo.messages.fetch(options)
//         messages.forEach(message => {
//             const msg = message.content;
//             let emojiStrings = msg.match(regex);

//             for(emojiString in emojiStrings) {
//                 const emoji = emojiStrings[emojiString].split(":"[1])
//                 emojiDict[emoji] = (emojiDict[emoji] || 0) + 1;
//             }
//         })

//         last_id = messages.last().id;

//         if(messages.createdTimestamp < 1604203200) {
//             break;
//         }

//         console.log(emojiDict)
//     }
//     return emojiDict
// }