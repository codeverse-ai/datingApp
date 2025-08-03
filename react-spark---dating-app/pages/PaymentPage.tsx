import React, { useState } from 'react';
import type { AppRoute } from '../types';
import { useAuth } from '../hooks/useAuth';
import { XIcon } from '../components/icons/XIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentPageProps {
  navigate: (path: AppRoute) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ navigate }) => {
    const { upgradeToPremium, user } = useAuth();
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        await new Promise(res => setTimeout(res, 2000));
        await upgradeToPremium();
        setProcessing(false);
        setPaymentSuccess(true);
        await new Promise(res => setTimeout(res, 2500));
        navigate('/app');
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 text-slate-800">
            <header className="flex-shrink-0 w-full p-4 flex items-center justify-between z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <h1 className="text-xl font-bold">Checkout</h1>
                <button onClick={() => navigate('/app')} className="p-2 rounded-full hover:bg-black/10 transition-colors">
                    <XIcon className="w-6 h-6 text-slate-700" />
                </button>
            </header>

            <main className="flex-grow p-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                {paymentSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring' }}
                        className="text-center p-8"
                    >
                         <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Payment Successful!</h2>
                        <p className="text-slate-500 mt-2">Welcome to Spark Premium, {user?.name}! Redirecting...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-md"
                    >
                        <div className="bg-white p-8 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Secure Payment</h2>
                            <p className="text-slate-500 mb-6">This is a simulated payment form for demonstration.</p>
                            <form onSubmit={handlePayment} className="space-y-4">
                                <div>
                                    <label htmlFor="card-number" className="block text-sm font-medium text-slate-600 mb-1">Card Number</label>
                                    <input type="text" id="card-number" placeholder="**** **** **** 4242" defaultValue="4242 4242 4242 4242" className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="expiry" className="block text-sm font-medium text-slate-600 mb-1">Expiry Date</label>
                                        <input type="text" id="expiry" placeholder="MM/YY" defaultValue="12/28" className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="cvc" className="block text-sm font-medium text-slate-600 mb-1">CVC</label>
                                        <input type="text" id="cvc" placeholder="123" defaultValue="123" className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500" />
                                    </div>
                                </div>
                                <div className="pt-4">
                                     <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full p-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-teal-500 rounded-full hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'Processing...' : 'Pay $8.33'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default PaymentPage;
