import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import emailjs from '@emailjs/browser';
import config from '../config';
import { useLanguage } from '../context/LanguageContext';

const ContactPage = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(t('contact.sending'));

        const serviceId = 'service_3kgz4up';
        const templateId = 'template_c9o14na';
        const publicKey = '_DZzUPPA6glcUDV3W';

        // Prepare template parameters
        const templateParams = {
            from_name: formData.name,
            from_email: formData.email,
            phone_number: formData.phone,
            message: formData.message,
            to_name: 'Admin', // Optional parameter for the template
        };

        try {
            // 1. Send Email (Priority)
            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log('Email sent successfully!');

            // 2. Save to Database (Secondary)
            const response = await fetch(`${config.API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                alert(t('contact.success'));
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                console.error('Database save failed, but email was sent.');
                alert(t('contact.email_only'));
            }
        } catch (error) {
            console.error('Error:', error);
            // Show exact error to user for debugging
            alert(t('contact.failed') + JSON.stringify(error));
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-green-900">{t('contact.title')}</h1>
            <p className="text-center text-gray-600 mb-8">
                {t('contact.subtitle')}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('contact.name')}</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                        placeholder={t('contact.name_placeholder')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('contact.email')}</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            placeholder={t('contact.email_placeholder')}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">{t('contact.phone')}</label>
                        <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition"
                            placeholder={t('contact.phone_placeholder')}
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">{t('contact.message')}</label>
                    <textarea
                        className="w-full px-4 py-3 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition h-32"
                        placeholder={t('contact.message_placeholder')}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                    ></textarea>
                </div>

                <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
                    {t('contact.send')}
                </button>
            </form>
        </div>
    );
};

export default ContactPage;
