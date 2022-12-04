const fetch = require('electron-fetch').default
const uri = 'http://localhost:8090/Y-Server-1.0-SNAPSHOT/api/'

function update_blockchain(publicKey, hash) {
    try {
        postData = {};

        postData.publicKey = publicKey;
        postData.contentHash = hash;

        fetch(uri + 'transaction/', { method: 'POST', body: JSON.stringify(postData) })
        	.then(res => res.json())
        	.then(json => console.log(json))
    } catch(e) {
        console.log(e)
    }
}

async function count_followers(publicKey) {
    try {
        postData = {};

        postData.publicKey = publicKey

        res = await fetch(uri + 'count_followers/', { method: 'POST', body: JSON.stringify(postData) });
        return res.json();
    } catch(e) {
        console.log(e)
        return "{}"
    }
}

function add_follower(publicKeyArtist, publicKeyFollower) {
    try {
        postData = {};

        postData.artistPublicKey = publicKeyArtist
        postData.followerPublicKey = publicKeyFollower

        fetch(uri + 'add_follower/', { method: 'POST', body: JSON.stringify(postData) })
        	.then(res => res.json())
        	.then(json => console.log(json))
    } catch(e) {
        console.log(e)
    }
}

module.exports = {
   update_blockchain,
   count_followers,
   add_follower
}
