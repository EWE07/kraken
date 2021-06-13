const mysql = require('mysql');
const config = require('../config');
const { METRIC_QUERIES, USER_QUERY, EMOTE_QUERY, ORDER } = require('../constants')

function process(message, args, client) {
    let queryString;
    let ordering = ORDER[args[0]];
    let arrangement = 'desc';

    switch(args[1]) {
        case '-s':
            const metric = args[2];
            arrangement = metric === 'leu' ? 'asc' : 'desc';
            queryString = `${METRIC_QUERIES[metric]} order by ${ordering} ${arrangement} limit 25`;
            break;
        case '-u':
            const user = args[2].replace(/[^0-9]/g, ""); // Stripping down to numeric characters for compatibility with SQL data\
            const users = [...message.guild.members.cache.keys()];

            if(users.includes(user)) {
                queryString = `${USER_QUERY} where userId = ${user} group by 1 order by ${ordering} ${arrangement} limit 25;`
            }
            break;
        case '-e':
            const emote = args[2]; 
            let emotes = [];
            message.guild.emojis.cache.forEach(emote => {
                let emoteString = `<:${emote.name}:${emote.id}>`
                emotes.push(emoteString)
            });

            if(emotes.includes(emote)) {
                queryString = `with emote as (select '${emote}' as value) ${EMOTE_QUERY} order by ${ordering} ${arrangement} limit 25;`
                break;
            }
            break;
        default:
            break;
    }

    const con = getConnection()
    con.connect(function(err) {
        if(err) throw err;
        con.query(queryString, function(error, result, fields) {
            let users = [];
            let reactions = [];
            let messages = [];

            result.forEach(row => {
                users.push(row.col1);
                reactions.push(row.col2);
                messages.push(row.col3);
            })
            
            let userValues = users.join('\n');
            let reactionValues = reactions.join('\n');
            let messageValues = messages.join('\n');

            const embed = {
                "title": "Emote Leaderboards",
                "color": 7303028,
                "fields": [
                {
                    "name": "Name",
                    "value": userValues,
                    "inline": true
                },
                {
                    "name": "Reactions",
                    "value": reactionValues,
                    "inline": true
                },
                {
                    "name": "Messages",
                    "value": messageValues,
                    "inline": true
                }
                ]
            };

            message.channel.send({embed})
        })

        con.end();
    });
}

function getConnection() {
    return mysql.createConnection(config.db);
}

module.exports = {
    name: 'emote',
    description: 'Emote usage statistics',
    execute(message, args, client) {
        process(message, args, client);
    }
}