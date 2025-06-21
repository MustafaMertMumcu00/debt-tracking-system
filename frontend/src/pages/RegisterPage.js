import React, { useState } from 'react';
import { register } from '../services/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import InteractiveBackground from '../components/InteractiveBackground';

const RegisterVisual = () => (
    <div className="hidden lg:flex w-3/5 items-center justify-center p-12 flex-col text-center">
      <svg className="w-48 h-48 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
      <h1 className="text-3xl font-bold text-white mt-6">Borç Takip Sistemine Bugün Katılın.</h1>
      <p className="text-gray-400 mt-2">Güvenli ve şeffaf bir mutabakat süreciyle başlayın.</p>
    </div>
);

function RegisterPage() {
  /* Dinamik veri tutma */
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    /* Sayfa akışı için preventDefault */
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Lütfen tüm alanları doldurun.');
      setLoading(false);
      return;
    }
    if (!validateEmail(formData.email)) {
      setError('Lütfen geçerli bir e-posta adresi girin.');
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter uzunluğunda olmalıdır.');
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      if (response.success) {
        toast.success(response.message || 'Kayıt başarılı!', {
          icon: <FaCheckCircle className="text-blue-500" />
        });
        // Formu resetliyor
        setFormData({ name: '', email: '', password: '' });
        e.target.reset();
      } else {
        setError(response.message || 'Kayıt başarısız oldu. Lütfen tekrar deneyin.');
        toast.error(response.message || 'Kayıt başarısız oldu.');
      }
    } catch (err) {
      const errorMessage = err.message || 'Beklenmedik bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex interactive-bg-container">
      <InteractiveBackground />
      <RegisterVisual />

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-gray-900/40 backdrop-blur-xl border-l border-gray-700/50">
        <div className="w-full max-w-md">
          <div className="text-left mb-10">
            <h2 className="text-4xl font-bold text-white">Hesap Oluştur</h2>
            <p className="text-gray-400 mt-2">Ücretsiz hesabınızla başlayın.</p>
          </div>

          {error && <div className="bg-red-800 border border-red-600 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="name">Ad Soyad</label>
              <input id="name" name="name" type="text" onChange={handleChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Adınız Soyadınız" required />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">E-posta Adresi</label>
              <input id="email" name="email" type="email" onChange={handleChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="örnek@mail.com" required />
            </div>
            
            <div className="relative">
              <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">Şifre</label>
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-7 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            
            <div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-500 transition-colors">
                {loading ? 'Kaydediliyor...' : 'Hesap Oluştur'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm">
              Zaten bir hesabınız var mı?{' '}
              <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300">
                Buradan giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;