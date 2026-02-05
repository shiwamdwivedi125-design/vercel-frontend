const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    village: {
        type: String,
        required: true,
    },
    farmingMethod: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
    },
    bio: {
        type: String,
    },
    image: {
        type: String, // URL to image
    }
}, { timestamps: true });

const Farmer = mongoose.model('Farmer', farmerSchema);
module.exports = Farmer;
