import { useState } from "react";
import emailjs from '@emailjs/browser';
import { playSound } from '../utils/soundManager';

const ContactMe = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            // emailjs configuration
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            // initialize emailjs with public key
            emailjs.init(publicKey);

            const templateParams = {
                name: formData.name,
                email: formData.email,
                message: formData.message,
                time: new Date().toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                })
            };

            const response = await emailjs.send(serviceId, templateId, templateParams);

            setStatus({
                type: 'success',
                message: 'Message sent successfully.'
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Email sending failed:', error);
            console.error('Error details:', error.text || error.message);
            setStatus({
                type: 'error',
                message: error.text || error.message || 'Could not send message.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100%' }}>
            <div style={{ width: '100%', maxWidth: '500px', marginLeft: '30px' }}>
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Get In Touch</h2>
                    <p style={{ margin: 0, fontSize: '14px' }}>
                        I'd love to hear from you! Fill out the form below to send me a message.
                    </p>
                </div>

                {status.message && (
                    <div className="alert-box outer-border" style={{ marginBottom: '20px' }}>
                        <div className="inner-border">
                            <div className="alert-contents">
                                <section className="field-row" style={{ justifyContent: 'flex-start' }}>
                                    <div className="square"></div>
                                    <p className="alert-text" style={{ paddingLeft: '10px' }}>
                                        {status.type === 'error' ? 'Alert: ' : 'Note: '}{status.message}
                                    </p>
                                </section>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <fieldset style={{ marginBottom: '20px' }}>
                        <legend>Your Information</legend>

                        <div className="field-row" style={{ marginBottom: '15px' }}>
                            <label htmlFor="name" style={{ display: 'inline-block', width: '100px', fontWeight: 'bold' }}>
                                Name:
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                required
                                disabled={isSubmitting}
                                style={{ width: 'calc(100% - 110px)' }}
                            />
                        </div>

                        <div className="field-row">
                            <label htmlFor="email" style={{ display: 'inline-block', width: '100px', fontWeight: 'bold' }}>
                                Email:
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="johnappleseed@gmail.com"
                                required
                                disabled={isSubmitting}
                                style={{ width: 'calc(100% - 110px)' }}
                            />
                        </div>
                    </fieldset>

                    <fieldset style={{ marginBottom: '20px' }}>
                        <legend>Your Message</legend>

                        <div className="field-row">
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Type your message here..."
                                required
                                disabled={isSubmitting}
                                rows="8"
                                style={{ width: '100%', resize: 'vertical' }}
                            />
                        </div>
                    </fieldset>

                    <div className="field-row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                            onClick={() => playSound('btnp')}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Email'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ContactMe;
