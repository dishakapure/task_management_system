const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const pool = require("./config/db");

const taskRoutes = require("./routes/taskRoutes");
const taskLogRoutes = require("./routes/taskLogRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());


// =========================
// ROUTES
// =========================
app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/task-logs", taskLogRoutes);

// =========================
// DATABASE CONNECTION TEST
// =========================

pool.query("SELECT NOW()")
    .then((result) => {

        console.log("PostgreSQL Connected");

        console.log(result.rows);

    })
    .catch((err) => {

        console.log("Database Error:");

        console.log(err);
    });


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {

    res.json({
        message: "Task Management API Running"
    });
});


// =========================
// DATABASE TEST ROUTE
// =========================

app.get("/test-db", async (req, res) => {

    try {

        const result =
            await pool.query("SELECT NOW()");

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// =========================
// SERVER
// =========================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);
});