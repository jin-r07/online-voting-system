require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const multichain = require("multichain-node")({
//     host: process.env.MULTICHAIN_HOST,
//     port: process.env.MULTICHAIN_PORT,
//     user: process.env.MULTICHAIN_USER,
//     pass: process.env.MULTICHAIN_PASS
// });
const path = require('path');
const { createAdmin } = require("./scripts/setup");

// User
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const authenticatedRoute = require("./routes/authenticated");
const otpRoute = require("./routes/otp");

// Admin
const adminLoginRoute = require("./routes/adminLogin");
const partyRoute = require("./routes/parties");
const candidateRoute = require("./routes/candidates");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
// Middleware to enable CORS
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

createAdmin();

// User
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", logoutRoute);
app.use("/api", authenticatedRoute);
app.use("/api", otpRoute);

// Admin
app.use("/api-admin", adminLoginRoute);
app.use("/api-admin", partyRoute);
app.use("/api-admin", candidateRoute);

// Middleware to serve static files
app.use("/uploads", express.static(path.join(__dirname, "scripts/uploads")));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
