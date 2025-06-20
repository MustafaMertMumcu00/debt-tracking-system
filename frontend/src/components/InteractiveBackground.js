import React, { useEffect } from 'react';

function InteractiveBackground() {

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Performans için requestAnimationFrame kullanıyoruz.
      // Bu, tarayıcının bir sonraki render (mouse'ın hareket etmesi) döngüsünde güncelleme yapmasını sağlar.
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--y', `${e.clientY}px`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Bileşen unmount edildiğinde event listener'ı temizle (çok önemli!)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.style.removeProperty('--x');
      document.documentElement.style.removeProperty('--y');
    };
  }, []); // Boş dependency array'i sayesinde bu effect sadece bir kez çalışır.

  // Bu bileşen görsel bir çıktı üretmez, sadece arka planı etkiler.
  return null;
}

export default InteractiveBackground;