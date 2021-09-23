const request = require('request');
const fs = require('fs');
const sharp = require('sharp');
const gifResize = require('@gumlet/gif-resize');

const baseUrl = 'https://cdn.discordapp.com/emojis';
const imgPath = './images/resized'

function process(message, args, client) {
    const filetype = args[0].startsWith("<a:") ? 'gif' : 'png'
    if(typeof(args[1]) === 'undefined') {
        message.reply("Please try again and provide a dimension")
    } else if (!isAllowedDimension(args[1])) {
        message.reply("Please provide a valid dimension")
    } else {
        let emoteId = args[0].split(":")[2].replace(/\D/g, "")
        let url = `${baseUrl}/${emoteId}.${filetype}`
        let dimension = parseInt(args[1], 10);

        request({url, encoding: null}, (err, response, buffer) => {
            switch(filetype) {
                case 'gif':
                    gifResize({
                        width: dimension
                    })(buffer).then(data => {
                        let resized = Buffer.from(data,'base64')

                        fs.writeFile(`${imgPath}.${filetype}`, resized, function() {
                            console.log("Done")
                        })
                        
                        options = {}
                        options['files'] = [`${imgPath}.${filetype}`]
            
                        message.reply(options)
                    })
                    break;
                case 'png':
                    sharp(buffer).resize(dimension, dimension).toFormat(filetype).toBuffer().then(buffer => {
                        let resized = Buffer.from(buffer, 'base64')
            
                        fs.writeFile(`${imgPath}.${filetype}`, resized, function() {
                            console.log("Done")
                        })
                        
                        options = {}
                        options['files'] = [`${imgPath}.${filetype}`]
            
                        message.reply(options)
                    })
                    break;
                default:
                    console.log("No filetype")
            }
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