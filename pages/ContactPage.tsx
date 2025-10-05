
import React, { useState } from 'react';
import Button from '../components/ui/Button';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        // Simulate API call
        setTimeout(() => {
            if(name && email && message) {
                setSubmitStatus('success');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setSubmitStatus('error');
            }
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-green-800">Get In Touch</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        We’d love to hear from you! Whether you have a question, feedback, or need support, our team is here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                                <input
                                    type="text"
                                    name="full-name"
                                    id="full-name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-green-500 focus:border border-gray-300 rounded-md"
                                    placeholder="Your message..."
                                    required
                                ></textarea>
                            </div>
                            <div>
                                <Button type="submit" isLoading={isSubmitting} className="w-full">
                                    Send Message
                                </Button>
                            </div>

                            {submitStatus === 'success' && (
                                <div className="rounded-md bg-green-50 p-4">
                                    <p className="text-sm font-medium text-green-800 text-center">Thank you! Your message has been sent successfully.</p>
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                 <div className="rounded-md bg-red-50 p-4">
                                    <p className="text-sm font-medium text-red-800 text-center">Oops! Something went wrong. Please fill out all fields and try again.</p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Company Details */}
                    <div className="lg:col-span-2 bg-green-50 rounded-lg p-8">
                         <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
                         <div className="space-y-6 text-gray-700">
                             <div className="flex items-start">
                                 <i className="fas fa-map-marker-alt text-green-600 mt-1 w-6 text-center"></i>
                                 <div className="ml-3">
                                     <h3 className="font-semibold">Our Address</h3>
                                     <p className="text-sm">123 Community Lane, Nourish City, NC 12345, United States</p>
                                 </div>
                             </div>
                             <div className="flex items-start">
                                 <i className="fas fa-envelope text-green-600 mt-1 w-6 text-center"></i>
                                 <div className="ml-3">
                                     <h3 className="font-semibold">Email Us</h3>
                                     <a href="mailto:support@nourish.net" className="text-sm text-green-700 hover:underline">support@nourish.net</a>
                                 </div>
                             </div>
                             <div className="flex items-start">
                                 <i className="fas fa-phone text-green-600 mt-1 w-6 text-center"></i>
                                 <div className="ml-3">
                                     <h3 className="font-semibold">Call Us</h3>
                                     <a href="tel:+1-555-123-4567" className="text-sm text-green-700 hover:underline">+1 (555) 123-4567</a>
                                 </div>
                             </div>
                              <div className="flex items-start">
                                 <i className="fas fa-clock text-green-600 mt-1 w-6 text-center"></i>
                                 <div className="ml-3">
                                     <h3 className="font-semibold">Operating Hours</h3>
                                     <p className="text-sm">Monday - Friday: 9:00 AM - 5:00 PM EST</p>
                                 </div>
                             </div>
                         </div>
                         <div className="mt-8 pt-6 border-t border-green-200">
                            <h3 className="font-semibold text-gray-800 mb-3 text-center">Follow Us</h3>
                            <div className="flex justify-center space-x-6">
                                <a href="#" className="text-gray-500 hover:text-green-700 text-2xl transition-colors"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-gray-500 hover:text-green-700 text-2xl transition-colors"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="text-gray-500 hover:text-green-700 text-2xl transition-colors"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="text-gray-500 hover:text-green-700 text-2xl transition-colors"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                         </div>
                    </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">Community Safety & Reporting</h2>
                        <p className="mt-3 text-gray-600 max-w-3xl mx-auto">
                            We are dedicated to maintaining a safe and respectful environment. If you see a food listing or community post that violates our guidelines (e.g., is inappropriate, spam, or a safety concern), please use the <i className="fas fa-flag text-gray-500"></i> report button located on the item itself. Our moderation team will review it promptly. For other issues, feel free to use the contact form.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactPage;