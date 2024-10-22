const crypto = require("crypto");

class Block {
    constructor(index, previousHash, timestamp, data, nonce = 0) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
        this.nonce = nonce;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        const { index, previousHash, timestamp, data, nonce } = this;
        return crypto.createHash("sha256")
            .update(index + previousHash + timestamp + JSON.stringify(data) + nonce)
            .digest("hex");
    }
}

module.exports = Block;
