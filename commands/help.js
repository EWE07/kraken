function process(message, args, client) {
    let response;
    switch(args[0]) {
        case '10man':
            response = tenman;
            break;
        case 'emote':
            response = emote;
            break;
        case 'dst':
            response = dst;
            break;
        default:
            response = defaultMessage;
            break;
    }
    message.channel.send(response)
}

const defaultMessage = "```md\n\
Available Commands\n\
==================\n\
* 10man  :  Generates two teams based on members within the voice channel\n\
* emote  :  Statistics, KPIs, OKRs on emote usage\n\
* dst    :  A pulse check on Smith's VALORANT performance\n\
\n\
> For additional information on any commands, type !help <command>\n\
```";

const tenman = "```md\n\
usage: 10man [-a]\n\
------------------\n\
  -a, --automove              Moves team two to the second voice channel\n\
\n\
> For any issues, reach out to @alex\n\
```";

const emote = "```md\n\
usage: emote [-r | -m] [-s] [-u] [-e]\n\
------------------\n\
  -r | -m                     Sorts by reactions (r) or messages (m)  \n\
\n\
  -s, -kpi, -okr <ACRONYM>    Metrics tracked at C-Suite level :hmmSuitL:\n\
  -u, --user <USER>           Emote usage for specified user\n\
  -e, --emote <EMOTE>         Power users for specified emote\n\
\n\
# ACRONYMS\n\
  teu    Top Emotes Used\n\
  epd    Emotes Per Day\n\
  cea    Channel Emote Activity\n\
  uea    User Emote Activity\n\
  leu    Lowest Emote Usage\n\
\n\
> For any issues, reach out to @alex\n\
```";

const dst = "```md\n\
usage: dst [-b] [-i | -d] \n\
------------------\n\
  -b, --balance               Hourly balance\n\
  -i | -d <AMOUNT>            Increments or decrements balance by specified amount\n\
\n\
> For any issues, reach out to @alex\n\
```";

module.exports = {
    name: 'help',
    description: 'If users need help with usage of bot commands',
    execute(message, args, client) {
        process(message, args, client);
    }
}