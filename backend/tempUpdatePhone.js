const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const updatePhone = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const email = 'shiwamdwivedi125@gmail.com'; // Fixed email from db scan
        const phone = '8340119050';

        const user = await User.findOneAndUpdate(
            { email },
            { phone },
            { new: true }
        );

        if (user) {
            console.log(`Success! Phone ${phone} has been linked to ${email}`);
        } else {
            console.log(`Error: User with email ${email} not found.`);
        }

        await mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Error updating phone:', error);
        process.exit(1);
    }
};

updatePhone();
