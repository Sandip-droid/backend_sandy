require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDb = require('./config/mongodb'); // MongoDB connection
const connectCloudinary = require('./config/clodinary'); // Cloudinary connection
const adminRoutes = require('./routes/adminRoutes'); // Admin routes

// --- APP CONFIG ---
const app = express();

// --- MIDDLEWARES ---
app.use(express.json());

// ✅ CORS setup (Netlify + Localhost support)
const allowedOrigins = [
  "https://magenta-crostata-5261f1.netlify.app", // ← Tumhara Netlify URL
  "http://localhost:5173" // Local testing
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// --- ROUTES ---
app.use('/api', adminRoutes);

app.get('/', (req, res) => {
    console.log("API is working");
    res.send("API is working");
});

// --- DB + Cloudinary Connect ---
connectDb();
connectCloudinary();

// --- SERVER START ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
});
