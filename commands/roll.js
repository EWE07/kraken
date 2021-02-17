const MAPS = {
    1: "ASCENT",
    2: "BIND",
    3: "SPLIT",
    4: "HAVEN",
    5: "ICEBOX"
}

const GAMES = {
    1: "VALORANT",
    2: "ARAM"
}

function process(message, args, client) {
    if(message.author.id == "129673348618649600") {
        message.channel.send("Make your own decisions")
    } else {
        switch(args[0]) {
            case "game":
                // let result = randomInteger(1, 2);
                message.channel.send(GAMES[randomInteger(1, 2)])
                break;
            case "map":
                // let result = randomInteger(1,5)
                message.channel.send(MAPS[randomInteger(1,5)])
                break;
            default:
                message.channel.send("Can't roll that, sorry.")
                break;
        }
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'roll',
    description: 'Rolls a VALORANT map for when people are having trouble deciding',
    execute(message, args, client) {
        process(message, args, client);
    }
}