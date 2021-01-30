const { HARRISON, HARRISON_GIF, GUILD_DETAILS } = require('../constants')

function process(message, args, client) {
    switch(message.author.id) {
        case HARRISON:
            message.channel.send(HARRISON_GIF);
            break;
        default:
            const guild = message.guild;

            const guildDetails = GUILD_DETAILS[guild.id];
            const voiceChannel = guild.channels.cache.get(guildDetails['VOICE_CHANNEL']);
            const textChannel = guild.channels.cache.get(guildDetails['TEXT_CHANNEL']);

            let automove = false;

            if(args.length === 1) {
                let userRoles = [...guild.members.cache.get(message.author.id).roles.cache.keys()]
                    if(args[0] === '--automove') {
                        if(userRoles.includes(guildDetails["IS_ABLE_TO_MOVE"])) {
                            automove = true;
                        } else {
                            textChannel.send("Specific role needed for automove. Only rolling teams.")
                        }
                    } else {
                        textChannel.send("Invalid argument. Only rolling teams")
                    }
            }

            let roster = []
            voiceChannel.members.forEach(member => {
                roster.push(member);
            });

            const shuffled = shuffle(roster);
            const half = Math.ceil(shuffled.length / 2);
            const teamOne = shuffled.splice(0, half);
            const teamTwo = shuffled.splice(-half);

            announce(textChannel, teamOne);
            announce(textChannel, teamTwo);

            if(automove) {
                textChannel.send("Moving team 2 in 15 seconds");
                setTimeout(() =>{
                    moveUsers(teamTwo, guildDetails["OTHER_VOICE_CHANNEL"])
                }, 15000);
            }                        
    }
}

function announce(channel, team) {
    let teamMembers = [];
    team.forEach(member => {
        if (member.nickname == null) {
            teamMembers.push(member.displayName);
        } else {
            teamMembers.push(member.nickname);
        }
    })

    let message = "**TEAM:**\n" + teamMembers.join('\n');
    channel.send(message);
}

function moveUsers(users, channel) {
    users.forEach(user => {
        user.voice.setChannel(channel)
    })
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

module.exports = {
    name: '10man',
    description: 'Randomizes users present in a voice channel into two separate teams',
    execute(message, args, client) {
        process(message, args, client);
    }
}