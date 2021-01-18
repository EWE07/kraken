const fs = require('fs');
const REQUESTER_FILE = './data/requester.txt';
const MATCH_FILE = './data/match.txt';
const PARTICIPANTS_FILE = './data/participants.json';

class FSUtils {
    constructor() {
    };

    writeRequester(id) {
        fs.writeFile(
            REQUESTER_FILE,
            id,
            function(err) {
                if(err) return console.log(err);
            }
        )
    }

    getRequester() {
        const id = fs.readFileSync(REQUESTER_FILE).toString();
        return id;
    }

    writeMatchId(id) {
        fs.writeFile(
            MATCH_FILE, 
            id,        
            function (err) {
                if (err) return console.log(err);
            }
        )
    }

    getMatchId() {
        const id = fs.readFileSync(MATCH_FILE).toString();
        return id
    }

    writeParticipants(participants) {
        fs.writeFile(
            PARTICIPANTS_FILE, 
            participants, //Make sure you've stringified.        
            function (err) {
                if (err) return console.log(err);
            }
        )
    }
}

module.exports = FSUtils;