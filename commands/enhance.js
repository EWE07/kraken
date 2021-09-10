const request = require('request');
const fs = require('fs');
const sharp = require('sharp');

const baseUrl = 'https://cdn.discordapp.com/emojis';
const imgPath = './images/resized.png'

function process(message, args, client) {
    if(typeof(args[1]) === 'undefined') {
        message.reply("Please try again and provide a dimension")
    } else if (!isAllowedDimension(args[1])) {
        message.reply("Please provide a valid dimension")
    } else {
        let emoteId = args[0].replace(/\D/g, "")
        let url = `${baseUrl}/${emoteId}.png`
        let dimension = parseInt(args[1], 10);
        request({url, encoding: null}, (err, response, buffer) => {
            sharp(buffer).resize(dimension, dimension).toFormat('png').toBuffer().then(buffer => {
                let resized = Buffer.from(buffer, 'base64')
    
                fs.writeFile(imgPath, resized, function() {
                    console.log("Done")
                })
                
                options = {}
                options['files'] = [imgPath]
    
                message.reply(options)
            })
        })
    }

}

function isAllowedDimension(dimension) {
    return ((Math.log(dimension)/Math.log(2)) % 1 === 0 && dimension <= 512)
}

module.exports = {
    name: 'enhance',
    description: 'Returns the emote in image form',
    execute(message, args, client) {
        process(message, args, client);
    }
}