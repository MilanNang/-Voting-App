const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
    console.error(" MongoDB URI is missing. Check your .env file.");
    process.exit(1);
}

mongoose.connect(mongoUrl)
.then(() => console.log(" MongoDB connected successfully"))
.catch(err => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
});

const db = mongoose.connection;

db.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

module.exports = db;
