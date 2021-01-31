const { SAVAJS, ROLE_BLACKLIST } = require('../constants')

function process(message, args, client) {
    const guild = message.guild
    const roleID = guild.roles.cache.find(role => role.name === args[0])
    
    if(guild == SAVAJS) {
        if(ROLE_BLACKLIST.includes(roleID)) {
            message.channel.send("This role is restricted from being removed from any user");
        } else {
            const memberID = message.author.id;
            guild.members.cache.get(memberID).roles.remove(roleID);
        }
        message.delete({ timeout: 5000 })
        .then(message => console.log(`Deleted message from ${message.author.username} after 5 seconds`))
        .catch(console.error);
    }
}

module.exports = {
    name: 'unsubscribe',
    description: 'Self service command for users to add/remove themselves to roles',
    execute(message, args, client) {
        process(message, args, client);
    }
}