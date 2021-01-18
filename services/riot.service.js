let axios = require('axios');

const riotBaseURL = 'https://na1.api.riotgames.com/lol/';

class RiotService {
    constructor(token) {
        this.token = token
    }

    async getSpectatorDetails(id) {
        let options = {
            headers: {
                'X-Riot-Token': this.token
            }
        }
        let client = axios.create({
            baseURL: riotBaseURL
        })

        return client.get(
            'spectator/v4/active-games/by-summoner/' + id,
            options
        )
    }

    async getMatchDetails(id) {
        var options = {
            headers: {
                'X-Riot-Token': this.token
            }
        }

        let client = axios.create({
            baseURL: riotBaseURL
        });

        return client.get(
            'match/v4/matches/' + id,
            options
        )
    }
}

module.exports = RiotService;