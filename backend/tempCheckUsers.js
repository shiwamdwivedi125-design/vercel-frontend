const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const findUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const users = await User.find({}, 'name email phone');
        console.log('--- ALL USERS IN DATABASE ---');
        console.log(users);
        console.log('-----------------------------');

        await mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Error finding users:', error);
        process.exit(1);
    }
};

findUsers();
