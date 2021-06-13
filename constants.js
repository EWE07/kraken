const TOKYO = "272239610992525312";
const SAVAJS = "671903536019406879";

const GUILD_DETAILS = {
    "272239610992525312": { // Tokyo
        "TEXT_CHANNEL": "778374191568257085",
        "VOICE_CHANNEL": "272239610992525313",
        "OTHER_VOICE_CHANNEL": "768667196615426088",
        "IS_ABLE_TO_MOVE": "800521208076304435"
    },
    "671903536019406879": { // SAVAJS
        "TEXT_CHANNEL": "796852473532776449",
        "VOICE_CHANNEL": "796851403737399306",
        "OTHER_VOICE_CHANNEL": "796846828175228970",
        "IS_ABLE_TO_MOVE": "760330665639542785"
    }
}

const ROLE_BLACKLIST = [
    "760330665639542785",
    "796847288881512480", 
    "805128528231399514" 
]

const HARRISON = "725070170422378577";
const HARRISON_GIF = 'https://tenor.com/sQvN.gif';

const METRIC_QUERIES = {
    'teu': 'select emoji as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events group by 1',
    'uea': 'select CONCAT("<@", userId, ">") as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events group by 1',
    'epd': 'with data as (select date(convert_tz(from_unixtime(timestamp / 1000), "UTC", "EST")) as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events group by 1 order by 1 desc limit 14) select cast(col1 as char) as col1, col2, col3 from data',
    'cea': 'select channel as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events group by 1',
    'leu': 'with emotes as (select emote from dbo.emotes) select emoji as col1, sum(case when type = "reaction" then 1 else 0 end) as col2, sum(case when type = "text" then 1 else 0 end) as col3 from dbo.events where emoji in (select emote from emotes) group by 1'
}

const USER_QUERY = "select emoji as col1, sum(case when type = 'reaction' then 1 else 0 end) as col2, sum(case when type = 'text' then 1 else 0 end) as col3 from dbo.events";
const EMOTE_QUERY = `select CONCAT("<@", userId, ">") as col1, sum(case when emoji = (select value from emote) and type = 'reaction' then 1 else 0 end) as col2, sum(case when emoji = (select value from emote) and type = 'text' then 1 else 0 end) as col3 from dbo.events group by 1`

const ORDER = {
    '-r': 'col2',
    '-m': 'col3'
};

module.exports = {
    TOKYO: TOKYO,
    SAVAJS: SAVAJS,
    GUILD_DETAILS: GUILD_DETAILS,
    HARRISON: HARRISON,
    HARRISON_GIF: HARRISON_GIF,
    ROLE_BLACKLIST: ROLE_BLACKLIST,
    METRIC_QUERIES: METRIC_QUERIES,
    USER_QUERY: USER_QUERY,
    EMOTE_QUERY: EMOTE_QUERY,
    ORDER: ORDER
}