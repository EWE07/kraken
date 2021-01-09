module.exports = {
    name: '10man',
    description: 'Randomizes users present in a voice channel into two separate teams',
    execute(message, args) {
        message.channel.send('User has requested for a ten man!');
    }
}