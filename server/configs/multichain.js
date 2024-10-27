const multichain = require("multichain-node")({
    host: process.env.MULTICHAIN_HOST,
    port: process.env.MULTICHAIN_PORT,
    user: process.env.MULTICHAIN_USER,
    pass: process.env.MULTICHAIN_PASS
});

module.exports = multichain;