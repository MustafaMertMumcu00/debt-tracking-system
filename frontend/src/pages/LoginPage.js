import React, { useState } from 'react';
import { login as apiLogin } from '../services/api';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import InteractiveBackground from '../components/InteractiveBackground';

const LoginVisual = () => (
  <div className="hidden lg:flex w-3/5 items-center justify-center p-12 flex-col text-center">
    <svg className="w-48 h-48 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
    <h1 className="text-3xl font-bold text-white mt-6">Debt Confirmation, Simplified.</h1>
    <p className="text-gray-400 mt-2">Securely manage and confirm your financial statements.</p>
  </div>
);

function LoginPage() {
  /* Dinamik veri tutma */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    /* Sayfa akışını devam ettirmek için preventDefault*/
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await apiLogin({ email, password });
      if (response.success) {
        // API'den gelen kullanıcı bilgisiyle context'i güncelle
        login(response.user); 
        toast.success('Login Successful! Redirecting...', {
          icon: <FaCheckCircle className="text-blue-500" />
        });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(response.message || 'Invalid credentials. Please try again.');
        toast.error(response.message || 'Invalid credentials.');
        setLoading(false);
      }
    } catch (err) {
      const errorMessage =  err.message || 'An unexpected error occurred. Please check your connection.';
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex interactive-bg-container">
      <InteractiveBackground />
      <LoginVisual />
      
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-gray-900/40 backdrop-blur-xl border-l border-gray-700/50">
        <div className="w-full max-w-md">
          <div className="text-left mb-10">
            <h2 className="text-4xl font-bold text-white">Login</h2>
            <p className="text-gray-400 mt-2">Welcome back! Please enter your details.</p>
          </div>
          
          {error && (
            <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">Email Address</label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com" required
              />
            </div>
            
            <div className="relative">
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">Password</label>
              <input
                id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••" required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            
            <div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-500 transition-colors"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-blue-400 hover:text-blue-300">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;