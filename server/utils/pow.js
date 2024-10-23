function mineBlock(block, difficulty) {
    while (block.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
        block.nonce++;
        block.hash = block.calculateHash();
    }
    console.log(`Block mined: ${block.hash} with nonce: ${block.nonce}`);
    return block;
};

module.exports = { mineBlock };
