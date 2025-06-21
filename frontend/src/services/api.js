/**
 * @file API service that communicates with the Django REST Framework backend.
 */

// Django backend sunucusu adresi
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Genel bir API istek fonksiyonu. Token yönetimini ve hata yönetimini merkezileştirir.
 * @param {string} endpoint - İstek atılacak yol (örn: /login/).
 * @param {object} options - Fetch API için seçenekler (method, headers, body vb.).
 * @returns {Promise<any>} Sunucudan dönen JSON verisi.
 */
const apiRequest = async (endpoint, options = {}) => {
  // Token'ı sessionStorage'dan al
  const token = sessionStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Eğer token varsa, Authorization header'ını ekle
  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const errorData = await response.json();
        // Eğer bizim özel {success, message} formatımızda bir hata mesajı varsa, direkt onu kullan.
        if (errorData.message) {
          throw new Error(errorData.message);
        } else {
          // Değilse, Django'nun standart validasyon hataları için eski yöntemi kullan.
          const errorMessage = Object.values(errorData).flat().join(' ');
          throw new Error(errorMessage || 'Bir API hatası oluştu');
        }
      } else {
        throw new Error(`Sunucu hatası oluştu! Durum Kodu: ${response.status}`);
      }
    }
    
    // 204 No Content gibi durumlarda body olmayabilir
    if (response.status === 204) {
        return null;
    }

    return response.json();

  } catch (error) {
    console.error('API İsteği Başarısız:', error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin veya sunucunun çalıştığından emin olun.');
    }
    // Diğer hatalar için (örn: backend'den gelen bizim fırlattığımız hatalar)
    throw error;
  }
};

// --- API EXPORTLARI ---

/**
 * Kullanıcı girişi yapar.
 * @param {object} credentials { email, password }
 * @returns {Promise<object>}
 */
export const login = async (credentials) => {
  // Backend `username` bekliyor, ama bizim EmailBackend'imiz
  // bu 'username' alanını email olarak yorumlayacak.
  // Bu yüzden frontend'den gelen 'email'i 'username'e map edelim.
  const loginData = {
    username: credentials.email,
    password: credentials.password,
  };
    
  const response = await apiRequest('/login/', {
    method: 'POST',
    body: JSON.stringify(loginData),
  });

  if (response.success && response.token) {
    sessionStorage.setItem('authToken', response.token);
  }
  return response;
};

/**
 * Yeni bir kullanıcı kaydeder.
 * @param {object} userInfo { name, email, password }
 * @returns {Promise<object>}
 */
export const register = async (userInfo) => {
  return apiRequest('/register/', {
    method: 'POST',
    body: JSON.stringify(userInfo),
  });
};

/**
 * Belirli bir kullanıcının müşterilerini getirir.
 * @returns {Promise<Array>}
 */
export const fetchCustomers = async () => {
  // Artık userId göndermeye gerek yok, token kimin istek attığını söylüyor.
  return apiRequest('/customers/');
};

/**
 * Seçili müşterilere mesaj gönderir.
 * @param {Array<string>} customerIds The IDs of the customers to update.
 * @param {string} message The message content.
 * @returns {Promise<object>}
 */
export const sendToSelectedCustomers = async (customerIds, message) => {
  // Artık userId'ye gerek yok.
  return apiRequest(`/customers/send/`, {
      method: 'POST',
      body: JSON.stringify({ customerIds, message }),
  });
};