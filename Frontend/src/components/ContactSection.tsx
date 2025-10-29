import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Back from "@/assets/Back.png";
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';

const ContactSection = () => {
    const formRef = useRef();
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    const [sending, setSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const [statusType, setStatusType] = useState(null); // 'success' | 'error'

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        setStatusMessage(null);

        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then(() => {
                setStatusType('success');
                setStatusMessage('✅ Message sent successfully!');
                if (formRef.current) formRef.current.reset();
            })
            .catch((error) => {
                console.error('❌ Email send error:', error);
                setStatusType('error');
                setStatusMessage('❌ Failed to send the message. Please try again.');
            })
            .finally(() => {
                setSending(false);
                // Automatically clear message after 5 seconds
                setTimeout(() => setStatusMessage(null), 5000);
            });
    };

    return (
        <section
            className="relative w-full p-5 bg-white overflow-hidden flex flex-col items-center justify-between bg-cover bg-center"
            style={{ backgroundImage: `url(${Back})` }}
        >
            <div className="w-full max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-foreground mb-4 text-5xl lg:text-6xl font-semibold">
                        CONTACT US
                    </h1>
                </div>

                <div className="flex justify-center mb-12">
                    <Card className="w-full md:w-5/6 lg:w-4/5 xl:w-3/4 p-10 rounded-2xl shadow-lg bg-white/90">
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                                        FIRST NAME
                                    </label>
                                    <Input id="firstName" name="firstName" placeholder="First Name" className="bg-input border-0 rounded-full" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                                        LAST NAME
                                    </label>
                                    <Input id="lastName" name="lastName" placeholder="Last Name" className="bg-input border-0 rounded-full" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                                        EMAIL
                                    </label>
                                    <Input id="email" name="email" type="email" placeholder="yourmail@gmail.com" className="bg-input border-0 rounded-full" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                                        PHONE NUMBER
                                    </label>
                                    <Input id="phone" name="phone" type="tel" placeholder="+961 000 000" className="bg-input border-0 rounded-full" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2 uppercase tracking-wide">
                                    MESSAGE
                                </label>
                                <Textarea id="message" name="message" placeholder="Leave Us a Message" rows={6} className="bg-input border-0 rounded-2xl" />
                            </div>

                            {/* ✅ Animated Success/Error Message */}
                            <AnimatePresence>
                                {statusMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.4 }}
                                        className={`text-center p-3 rounded-xl text-sm font-medium ${statusType === 'success'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {statusMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-center">
                                <Button
                                    type="submit"
                                    disabled={sending}
                                    className="w-60 bg-[#D7DF21] hover:bg-[#D6DF25]/50 rounded-full text-black"
                                >
                                    {sending ? 'SENDING...' : 'SEND MESSAGE'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;

