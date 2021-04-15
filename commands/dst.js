var fs = require('fs')

function process(message, args, client) {
    let data = getBalance();
    switch(args[0]) {
        case "--balance":
            let response = `${data.balance} hours`
            message.channel.send(response)
            break;
        case "--increment":
            data['balance'] = data.balance + 1;
            updateBalance(data)
            message.channel.send(`New balance: ${data.balance}`)
            break;
        case "--decrement":
            data['balance'] = data.balance - 1;
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
    fs.writeFile('../data.balance.json', data, err => {
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