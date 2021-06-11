const mysql = require('mysql');
const config = require('../config');

function process(message, args, client) {
    let queryString;
    let orderBy;
    switch(args[0]) {
        case "--e":
            queryString = 'select emoji as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events group by 1 order by 2 desc, 3 desc limit 10;'
            break;
        case "--u":
            queryString = 'select CONCAT("<@", userId, ">") as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events group by 1 order by 2 desc, 3 desc;'
            break;
        case "--epd":
            queryString = 'with data as (select date(convert_tz(from_unixtime(timestamp / 1000), "UTC", "EST")) as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events group by 1 order by 1 desc limit 14) select cast(col1 as char) as col1, col2, col3 from data order by 1 desc;'
            break;
        case "--c":
            queryString = 'select channel as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events group by 1 order by 2 desc, 3 desc;'
            break;
        case "--user":
            let user = args[1].replace(/[^0-9]/g, "");
            let users = [...message.guild.members.cache.keys()];

            switch(args[2]) {
                case "-r":
                    orderBy = 'col2';
                    break;
                case "-m":
                    orderBy = 'col3';
                    break;
                default:
                    break;
            } 
            if(users.includes(user)) {
                queryString = `select emoji as col1, sum(case when type = 'reaction' then 1 else 0 end) as col2, sum(case when type = 'text' then 1 else 0 end) as col3 from dbo.events where userId = ${user} group by 1 order by ${orderBy} desc limit 10;`
            }
            break;
        case "--ube":
            let emote = args[1];
            let emojis = [];
            message.guild.emojis.cache.forEach(emoji => {
                let emojiString = `<:${emoji.name}:${emoji.id}>`
                emojis.push(emojiString)
            });

            switch(args[2]) {
                case "-r":
                    orderBy = 'col2';
                    break;
                case "-m":
                    orderBy = 'col3';
                    break;
                default:
                    break;
            }     

            if(emojis.includes(emote)) {
                queryString = `select CONCAT("<@", userId, ">") as col1, sum(case when emoji = '${emote}' and type = 'reaction' then 1 else 0 end) as col2, sum(case when emoji = '${emote}' and type = 'text' then 1 else 0 end) as col3 from dbo.events group by 1 order by ${orderBy} desc limit 10;`
                break;
            }
            break;
        case "--cull":
            switch(args[1]) {
                case "-r":
                    orderBy = 'col2';
                    break;
                case "-m":
                    orderBy = 'col3';
                    break;
                default:
                    break;
            }
            queryString = `with emotes as (select emote from dbo.emotes) select emoji as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events where emoji in (select emote from emotes) group by 1 order by ${orderBy} asc limit 25;`
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