require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
const { createAdmin } = require("./scripts/setup");
const cron = require("node-cron");
const Event = require("./models/events");
const { extractVoteDataForEvent, generateVotePDF } = require("./scripts/pdf");

// User
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const logoutRoute = require("./routes/logout");
const authenticatedRoute = require("./routes/authenticated");
const otpRoute = require("./routes/otp");
const contactRoute = require("./routes/contact");
const voteRoute = require("./routes/vote");
const profileRoute = require("./routes/profile");

// Admin
const adminLoginRoute = require("./routes/adminLogin");
const partyRoute = require("./routes/parties");
const candidateRoute = require("./routes/candidates");
const userRoute = require("./routes/users");
const eventRoute = require("./routes/events");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
createAdmin();

// User
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", logoutRoute);
app.use("/api", authenticatedRoute);
app.use("/api", otpRoute);
app.use("/api", contactRoute);
app.use("/api", voteRoute);
app.use("/api", profileRoute);

// Admin
app.use("/api-admin", adminLoginRoute);
app.use("/api-admin", partyRoute);
app.use("/api-admin", candidateRoute);
app.use("/api-admin", userRoute);
app.use("/api-admin", eventRoute);

// Middleware to serve static files
app.use("/uploads", express.static(path.join(__dirname, "scripts/uploads")));

// Scheduler to schedule events status
const updateEventStatuses = async () => {
    const now = new Date();
    try {
        const events = await Event.find({});

        for (const event of events) {
            const previousStatus = event.status;

            if (now < event.start) {
                event.status = "inactive";
            } else if (now >= event.start && now <= event.end) {
                event.status = "active";
            } else if (now > event.end) {
                event.status = "completed";
            }

            if (previousStatus !== event.status) {
                await event.save();
                console.log(`Updating status from "${previousStatus}" to "${event.status}"`);

                if (event.status === "completed") {
                    const votesCount = await extractVoteDataForEvent(event._id);
                    const pdfPath = await generateVotePDF(event._id, votesCount);
                    console.log("Pdf generated for: " + event.eventName);
                }
            }
        }
    } catch (error) {
        console.error("Error updating event statuses:", error);
    }
};

cron.schedule('* * * * *', updateEventStatuses);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
