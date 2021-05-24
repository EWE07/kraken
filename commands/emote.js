const mysql = require('mysql');
const config = require('../config');

function process(message, args, client) {
    let queryString
    switch(args[0]) {
        case "--e":
            queryString = 'select emoji as col1, count(*) as cnt from dbo.events group by 1 order by 2 desc limit 10;'
            break;
        case "--u":
            queryString = 'select CONCAT("<@", userId, ">") as col1, count(*) as cnt from dbo.events group by 1 order by 2 desc limit 10;'
            break;
        case "--epd":
            queryString = "with data as (select date(convert_tz(from_unixtime(timestamp / 1000), 'UTC', 'EST')) as col1, count(*) as cnt from dbo.events group by 1 order by 1 desc limit 14) select cast(col1 as char) as col1, cnt from data;"
            break;
        case "--c":
            queryString = "select channel as col1, count(*) as cnt from dbo.events group by 1 order by 2 desc limit 10;"
            break;
        default:
            break;
    }

    const con = getConnection()
    con.connect(function(err) {
        if(err) throw err;
        con.query(queryString, function(error, result, fields) {
            
            let data = []
            result.forEach(row => {
                data.push(`${row.col1}: ${row.cnt}`)  
            })
            
            let top5 = data.join('\n');

            const embed = {
                "title": "Emote Leaderboards",
                "color": 7303028,
                "fields": [
                {
                    "name": "Results",
                    "value": top5
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