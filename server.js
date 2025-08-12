require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDb = require('./backend/config/mongodb');
const connectCloudinary = require('./backend/config/clodinary');



const adminRoutes = require('./backend/routes/adminRoutes'); // Make sure this path is correct
// --- APP CONFIG ---
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


app.use('/api',adminRoutes)

//localhost

const PORT = process.env.PORT || 4000;

// Call the function to connect to the database after dotenv has loaded.
connectDb();
connectCloudinary();

// --- ROUTES ---
app.get('/', (req, res) => {
    console.log("API is working");
    res.send("API is working");
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
