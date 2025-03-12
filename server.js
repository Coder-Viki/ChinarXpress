require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Allow cross-origin requests

// Ensure environment variables are set
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error("❌ Missing environment variables! Set MONGO_URI & JWT_SECRET in .env file.");
    process.exit(1);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// User Schema
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    govt_id: { type: String, unique: true, required: true },
    vehicle_type: { type: String, required: true },
    vehicle_number: { type: String, required: true },
    experience: { type: Number, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// ✅ User Registration Route
app.post("/register", async (req, res) => {
    try {
        const { name, phone, email, govt_id, vehicle_type, vehicle_number, experience, password } = req.body;

        // Check if all fields are provided
        if (!name || !phone || !email || !govt_id || !vehicle_type || !vehicle_number || !experience || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists!" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new User({ name, phone, email, govt_id, vehicle_type, vehicle_number, experience, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "✅ User registered successfully!" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "❌ Error registering user", error: err.message });
    }
});

// ✅ User Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required!" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "❌ User not found!" });

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "❌ Invalid credentials!" });

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "✅ Login successful!", token, user });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "❌ Error logging in", error: err.message });
    }
});

// ✅ Server Listening on Localhost
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
