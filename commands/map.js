const MAPS = {
    1: "ASCENT",
    2: "BIND",
    3: "SPLIT",
    4: "HAVEN",
    5: "ICEBOX"
}

function process(message, args, client) {
    const result = randomInteger(1,5)
    message.channel.send(MAPS[result])
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'map',
    description: 'Rolls a VALORANT map for when people are having trouble deciding',
    execute(message, args, client) {
        process(message, args, client);
    }
}