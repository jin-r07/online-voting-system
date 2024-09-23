require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createAdmin } = require("./scripts/setup");

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const authenticatedRoute = require("./routes/authenticated");
const otpRoute = require("./routes/otp");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

createAdmin();

app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", logoutRoute);
app.use("/api", authenticatedRoute);
app.use("/api", otpRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});