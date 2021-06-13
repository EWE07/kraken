let acceptableUsers = [
    "217024547378036736",
    "183025406335516672"
]

var fs = require('fs')

function process(message, args, client) {
    if(!acceptableUsers.includes(message.author.id)) return;

    let data = getBalance();
    switch(args[0]) {
        case "-b":
        case "--balance":
            let response = `${data.balance} hours`
            message.channel.send(response)
            break;
        case "-i":
        case "--increment":
            if(isNaN(args[1])) return;

            data['balance'] = data.balance + parseFloat(args[1]);
            updateBalance(data)
            message.channel.send(`New balance: ${data.balance}`)
            break;
        case "-d":
        case "--decrement":
            if(isNaN(args[1])) return;

            data['balance'] = data.balance - parseFloat(args[1]);
            updateBalance(data)
            message.channel.send(`New balance: ${data.balance}`)
            break;
    }
}

function getBalance() {
    let data = require('../data/balance.json')
    return data
}

function updateBalance(balance) {
    const data = JSON.stringify(balance);
    fs.writeFile('./data.balance.json', data, err => {
        if(err) {
            console.log("Error writing file: ", err)
        } else {
            console.log(`Wrote new balance of ${balance.balance}`)
        }
    })
}

module.exports = {
    name: 'dst',
    description: 'All things related to Smith playing DST',
    execute(message, args, client) {
        process(message, args, client);
    }
}