const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const mySqlPool = require("./config/db");
const cors = require("cors");

// Create express app
const app = express();

// CORS config
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use('/api/v1/events', require("./routes/eventsRoutes")); // ✅ route file

// Test route
app.get("/test", (req, res) => {
    res.status(200).send("<h1>Node.js MySQL Event App is Working ✅</h1>");
});

// Port
const PORT = 8080;

// Start server only if DB is connected
mySqlPool.query('SELECT 1')
    .then(() => {
        console.log("✅ MySQL Connected Successfully".green);
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`.bgMagenta.white);
        });
    })
    .catch((error) => {
        console.error("❌ MySQL Connection Failed".red, error);
    });
