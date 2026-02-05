const mongoose = require('mongoose');
const Farmer = require('./models/Farmer');
require('dotenv').config();

const findFarmers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const farmers = await Farmer.find({}, 'name village image');
        console.log('--- ALL FARMERS IN DATABASE ---');
        console.log(JSON.stringify(farmers, null, 2));
        console.log('-----------------------------');

        await mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Error finding farmers:', error);
        process.exit(1);
    }
};

findFarmers();
