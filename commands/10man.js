const { HARRISON, HARRISON_GIF, GUILD_ID, CHANNELS } = require('../constants')

function process(message, client) {
    switch(message.author.id) {
        case HARRISON:
            message.channel.send(HARRISON_GIF);
            break;
        default:
            client.guilds.fetch(GUILD_ID)
            .then(guild => {
                const voiceChannel = guild.channels.cache.get(CHANNELS['TOKYO']);
                const textChannel = guild.channels.cache.get(CHANNELS['TEN_MEN']);

                let roster = [];

                voiceChannel.members.forEach(member => {
                    if (member.nickname == null) {
                        roster.push(member.displayName);
                    } else {
                        roster.push(member.nickname);
                    }
                });

                const shuffled = shuffle(roster);

                const half = Math.ceil(shuffled.length / 2);
                const firstHalf = shuffled.splice(0, half);
                const secondHalf = shuffled.splice(-half);

                let message = "**These are the users currently in Tokyo:** \n" + roster.join('\n');
                textChannel.send(message)

                let firstTeamMsg = "**FIRST TEAM IS: **\n" + firstHalf.join('\n');
                textChannel.send(firstTeamMsg);

                let secondTeamMsg = "**SECOND TEAM IS: **\n" + secondHalf.join('\n');
                textChannel.send(secondTeamMsg);
            })
    }
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
        process(message, client);
    }
}