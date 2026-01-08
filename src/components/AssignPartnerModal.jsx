import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AssignPartnerModal = ({ isOpen, onClose, orderId, onAssignSuccess }) => {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            fetchPartners();
        }
    }, [isOpen]);

    const fetchPartners = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const configObj = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            const { data } = await axios.get(`${config.API_URL}/api/orders/partners`, configObj);
            setPartners(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching partners:', error);
            setLoading(false);
        }
    };

    const handleAssign = async () => {
        if (!selectedPartner) return;
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const configObj = {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            };
            await axios.put(
                `${config.API_URL}/api/orders/${orderId}/assign`,
                { partnerId: selectedPartner },
                configObj
            );
            alert('Partner Assigned Successfully!');
            onAssignSuccess();
            onClose();
        } catch (error) {
            console.error('Error assigning partner:', error);
            alert('Failed to assign partner');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-4">Assign Delivery Partner</h3>

                {loading ? (
                    <p>Loading partners...</p>
                ) : (
                    <div className="space-y-4">
                        {partners.length === 0 ? (
                            <p className="text-gray-500">No partners found. Add one first.</p>
                        ) : (
                            <div className="space-y-2">
                                {partners.map((partner) => (
                                    <div
                                        key={partner._id}
                                        onClick={() => setSelectedPartner(partner._id)}
                                        className={`p-3 border rounded cursor-pointer flex justify-between items-center hover:bg-green-50 transition ${selectedPartner === partner._id ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                                    >
                                        <div>
                                            <p className="font-bold">{partner.name}</p>
                                            <p className="text-xs text-gray-500">{partner.vehicle}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs ${partner.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {partner.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 px-4 py-2">Cancel</button>
                            <button
                                onClick={handleAssign}
                                disabled={!selectedPartner}
                                className={`bg-green-600 text-white px-4 py-2 rounded shadow ${!selectedPartner ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignPartnerModal;
