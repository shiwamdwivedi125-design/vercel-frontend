const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 1. .env Configuration
dotenv.config();

const app = express();

// 2. Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// 3. Database Connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error("Error: MONGO_URI missing!");
            return;
        }
        await mongoose.connect(uri);
        console.log('MongoDB Connected successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message);
    }
};
connectDB();

// 4. Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.get('/api/config/paypal', (req, res) =>
    res.send(process.env.PAYPAL_CLIENT_ID)
);

const path = require('path');
// Fixed path for uploads (assuming backend and frontend are siblings in production too)
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/images')));

// 5. Deployment Logic
if (process.env.NODE_ENV === 'production') {
    // __dirname is backend folder, so we go up one level to reach frontend/dist
    const distPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) =>
        res.sendFile(path.join(distPath, 'index.html'))
    );
} else {
    // Main Page Route for dev
    app.get('/', (req, res) => {
        res.json({ message: 'Dharti Ka Swad Backend is running live!' });
    });
}

// 404 Route (only reached in dev or if not static file)
app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
});

// 5. Port Setting
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;