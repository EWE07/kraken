require('dotenv').config();

const Discord = require('discord.js');

const client = new Discord.Client();

client.login(process.env.TOKEN);

client.on('ready', () => {
    console.info(`Logged in as ${client.user.tag}!`);
})