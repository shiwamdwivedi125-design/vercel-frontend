const mongoose = require('mongoose');
const Farmer = require('./models/Farmer');
require('dotenv').config();

const updateFarmerImage = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const result = await Farmer.findOneAndUpdate(
            { name: 'Gopal Krishna Dairy' },
            { image: '/images/gopal_dairy.png' },
            { new: true }
        );

        if (result) {
            console.log('Success: Farmer image updated in DB.');
            console.log(result);
        } else {
            console.log('Error: Farmer not found.');
        }

        await mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Error updating farmer:', error);
        process.exit(1);
    }
};

updateFarmerImage();
