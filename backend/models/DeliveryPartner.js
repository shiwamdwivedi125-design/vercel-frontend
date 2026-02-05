const mongoose = require('mongoose');

const deliveryPartnerSchema = mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    vehicle: { type: String, required: true }, // e.g. "Bike - DL 3S 1234"
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Busy', 'Offline'],
        default: 'Available'
    },
    image: { type: String, default: '/images/default_partner.png' },
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number }
    },
    totalDeliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 5.0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
