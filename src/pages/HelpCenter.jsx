import { useState, useRef, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { FaPaperPlane, FaRobot, FaUser, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const HelpCenter = () => {
    const { t } = useLanguage();
    const { userInfo } = useContext(AuthContext);
    const [messages, setMessages] = useState([
        { id: 1, text: t('help.bot_start'), sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = {
            id: messages.length + 1,
            text: input,
            sender: 'user',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Logic
        setTimeout(() => {
            let botResponse = "";
            const query = input.toLowerCase();

            if (query.includes('order')) {
                botResponse = t('help.bot_order');
            } else if (query.includes('payment') || query.includes('refund')) {
                botResponse = t('help.bot_payment');
            } else if (query.includes('momos') || query.includes('paneer') || query.includes('products')) {
                botResponse = t('help.bot_product');
            } else if (query.includes('farmer') || query.includes('source')) {
                botResponse = t('help.bot_farmer');
            } else {
                botResponse = t('help.bot_default');
            }

            const botMsg = {
                id: messages.length + 2,
                text: botResponse,
                sender: 'bot',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const faqs = [
        { q: t('help.faq_q1'), a: t('help.faq_a1') },
        { q: t('help.faq_q2'), a: t('help.faq_a2') },
        { q: t('help.faq_q3'), a: t('help.faq_a3') },
        { q: t('help.faq_q4'), a: t('help.faq_a4') }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-inter">
            {/* Header */}
            <header className="bg-green-900 text-white py-12 px-4 rounded-b-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="container mx-auto max-w-5xl relative z-10">
                    <Link to="/profile" className="inline-flex items-center gap-2 text-green-200 hover:text-white transition mb-6">
                        <FaArrowLeft /> {t('help.back')}
                    </Link>
                    <h1 className="text-5xl font-black tracking-tighter mb-4">{t('help.title').split('?')[0]} <span className="text-green-400">help?</span></h1>
                    <p className="text-green-100/70 text-lg max-w-2xl font-medium">
                        {t('help.subtitle')}
                    </p>
                </div>
            </header>

            <div className="container mx-auto max-w-5xl -mt-10 px-4">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* FAQs Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-soft border border-gray-100 h-fit">
                            <h2 className="text-2xl font-black text-green-950 tracking-tighter mb-6 flex items-center gap-2">
                                <FaQuestionCircle className="text-green-600" /> {t('help.faqs')}
                            </h2>
                            <div className="space-y-6">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="group">
                                        <p className="font-bold text-gray-800 text-sm group-hover:text-green-600 transition cursor-help mb-1">Q: {faq.q}</p>
                                        <p className="text-gray-500 text-xs leading-relaxed">{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 rounded-[2rem] text-white shadow-xl">
                            <h3 className="font-black text-xl mb-2">{t('help.human_title')}</h3>
                            <p className="text-green-50/80 text-sm mb-6">{t('help.human_desc')}</p>
                            <Link to="/contact">
                                <button className="w-full bg-white text-green-700 font-bold py-3 rounded-xl shadow-lg hover:bg-green-50 transition">
                                    {t('help.contact_btn')}
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* AI Chat Agent Section */}
                    <div className="lg:col-span-2 flex flex-col h-[600px] bg-white rounded-[2.5rem] shadow-soft border border-gray-100 overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-6 bg-white border-b border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                    <FaRobot />
                                </div>
                                <div>
                                    <h3 className="font-black text-green-950 leading-tight">{t('help.ai_title')}</h3>
                                    <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></span> {t('help.ai_status')}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest">
                                {t('help.ai_badge')}
                            </span>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm shadow-sm flex-shrink-0 ${msg.sender === 'user' ? 'bg-green-600 text-white' : 'bg-white text-green-600'
                                            }`}>
                                            {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                                        </div>
                                        <div>
                                            <div className={`p-4 rounded-2xl text-sm shadow-sm ${msg.sender === 'user'
                                                ? 'bg-green-600 text-white rounded-tr-none'
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                                }`}>
                                                {msg.text}
                                            </div>
                                            <p className={`text-[10px] mt-1 font-bold text-gray-400 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                                {msg.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 flex gap-1">
                                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-50">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={t('help.placeholder')}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-green-500/20 text-gray-800 font-medium placeholder:text-gray-400 transition"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 bottom-2 bg-green-600 text-white px-5 rounded-xl hover:bg-green-500 transition shadow-lg active:scale-95 flex items-center justify-center"
                                >
                                    <FaPaperPlane />
                                </button>
                            </form>
                            <p className="text-[10px] text-center text-gray-400 mt-4 font-bold uppercase tracking-widest">
                                {t('help.powered')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;
