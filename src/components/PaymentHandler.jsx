import { useState } from 'react';
import config from '../config';
import { useLanguage } from '../context/LanguageContext';

const PaymentHandler = ({ amount, orderId, paymentMethod, onPaymentSuccess }) => {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);

    const loadRazorpayScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        setLoading(true);

        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            alert(t('common.login_req'));
            setLoading(false);
            return;
        }

        const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert(t('payment.sdk_fail'));
            setLoading(false);
            return;
        }

        try {
            // 1. Get Key ID
            const keyResponse = await fetch(`${config.API_URL}/api/payment/key`, {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            const keyData = await keyResponse.json();
            const keyId = keyData.keyId;

            if (!keyId || keyId === 'your_razorpay_key_id') {
                alert(t('payment.key_missing'));
                setLoading(false);
                return;
            }

            // 2. Create Razorpay Order
            const response = await fetch(`${config.API_URL}/api/payment/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`
                },
                body: JSON.stringify({ amount: amount })
            });

            if (!response.ok) {
                throw new Error('Failed to create payment order');
            }

            const data = await response.json();

            // 3. Open Razorpay Options
            const options = {
                key: keyId,
                amount: data.amount,
                currency: data.currency,
                name: 'Dharti Ka Swad',
                description: 'Organic Food Payment',
                image: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png', // Logo
                order_id: data.id,
                handler: async function (response) {
                    // 4. Verify Payment
                    try {
                        const verifyRes = await fetch(`${config.API_URL}/api/payment/verify`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${userInfo.token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: orderId // Pass the internal order ID we received as prop
                            })
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok && verifyData.status === 'success') {
                            onPaymentSuccess(verifyData);
                        } else {
                            alert(t('payment.verify_fail') + (verifyData.message || 'Unknown error'));
                        }

                    } catch (error) {
                        alert(t('common.server_error') + " " + error.message);
                        console.error(error);
                    }
                },
                prefill: {
                    name: userInfo?.name || "User",
                    email: userInfo?.email || "user@example.com",
                    contact: ""
                },
                theme: {
                    color: "#166534"
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Payment Initialization Error:', error);
            alert(t('payment.init_fail') + error.message);
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
        >
            {loading ? t('payment.processing') : t('payment.pay_via').replace('{method}', paymentMethod || 'Online').replace('{amount}', amount)}
        </button>
    );
};

export default PaymentHandler;
