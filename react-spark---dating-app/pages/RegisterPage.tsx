

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { SocialLoginProvider, AppRoute } from '../types';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { FacebookIcon } from '../components/icons/FacebookIcon';

interface RegisterPageProps {
  navigate: (path: AppRoute) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<SocialLoginProvider | null>(null);
  const { register, socialLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || socialLoading) return;
    setError('');
    setLoading(true);
    const success = await register(name, email, password);
    if (!success) {
      setError('An account with this email already exists.');
    }
    setLoading(false);
  };

  const handleSocialLogin = async (provider: SocialLoginProvider) => {
    if (loading || socialLoading) return;
    setError('');
    setSocialLoading(provider);
    await socialLogin(provider);
    setSocialLoading(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 bg-slate-50">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F06292] to-rose-400 mb-8 text-center">
          Join Spark
        </h1>

        <div className="space-y-4">
          <button 
            onClick={() => handleSocialLogin('google')}
            disabled={!!socialLoading || loading}
            className="w-full flex items-center justify-center space-x-3 p-3 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            <GoogleIcon className="w-6 h-6" />
            <span>{socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
          </button>
          <button 
            onClick={() => handleSocialLogin('facebook')}
            disabled={!!socialLoading || loading}
            className="w-full flex items-center justify-center space-x-3 p-3 font-semibold text-white bg-[#1877F2] rounded-lg hover:bg-[#166ee1] transition-colors disabled:opacity-50"
          >
            <FacebookIcon className="w-6 h-6" />
            <span>{socialLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}</span>
          </button>
        </div>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-sm">OR</span>
            <div className="flex-grow border-t border-slate-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292] placeholder-slate-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292] placeholder-slate-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06292] placeholder-slate-400"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full p-3 text-lg font-semibold text-white bg-[#F06292] rounded-lg hover:bg-rose-500 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-6 text-slate-500">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="font-semibold text-[#F06292] hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;