require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multichain = require("multichain-node")({
    host: process.env.MULTICHAIN_HOST,
    port: process.env.MULTICHAIN_PORT,
    user: process.env.MULTICHAIN_USER,
    pass: process.env.MULTICHAIN_PASS
});
const { createAdmin } = require("./scripts/setup");

// User
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const authenticatedRoute = require("./routes/authenticated");
const otpRoute = require("./routes/otp");

// Admin
const adminLoginRoute = require("./routes/adminLogin");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

createAdmin();

// Test Blockchain Connection
app.get("/api/blockchain-info", (req, res) => {
    multichain.getInfo((err, info) => {
        if (err) {
            console.error("Blockchain connection error:", err); // Log the error for debugging
            return res.status(500).json({ error: "Failed to connect to blockchain" });
        }
        res.json(info);
    });
});

// User
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", logoutRoute);
app.use("/api", authenticatedRoute);
app.use("/api", otpRoute);

// Admin
app.use("/api-admin", adminLoginRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
