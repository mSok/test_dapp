

export function initContract(web3, web3Provider) {
    let data = getContractJSON()
    var Contracts = TruffleContract(data)
    Contracts.setProvider(web3Provider)
    return {
        'web3': web3,
        'web3Provider': web3Provider,
        'Contracts': Contracts
    }
};

export function getContractJSON () {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/Contracts.json', false);
        xhr.send();
        if (xhr.status != 200) {
            console.error( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
            return false
        } else {
            return ( xhr.responseText ); // responseText -- текст ответа.
        }
};

export function initWeb3 () {
    // TODO: refactor conditional
    var web3Provider;
    if (typeof web3 !== 'undefined') {
        // If a web3 instance is already provided by Meta Mask.
        web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
    } else {
        // Specify default instance if no web3 instance provided
        web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        web3 = new Web3(web3Provider)
    }
    return initContract(web3, web3Provider)
};
