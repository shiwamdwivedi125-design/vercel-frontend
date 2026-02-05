import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const AddPartnerModal = ({ isOpen, onClose, onPartnerAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        vehicle: ''
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const configObj = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            };
            await axios.post(`${config.API_URL}/api/orders/partners`, formData, configObj);
            onPartnerAdded();
            onClose();
            alert('Partner Added Successfully');
        } catch (error) {
            console.error(error);
            alert('Error adding partner');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add Delivery Partner</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Partner Name"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="vehicle"
                        placeholder="Vehicle Details (e.g. Bike DL-1234)"
                        className="w-full border p-2 rounded"
                        onChange={handleChange}
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="text-gray-500">Cancel</button>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPartnerModal;
