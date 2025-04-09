'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function IranMap() {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // تابع جدید برای دریافت موقعیت از IP
  const getLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/', {
        headers: {
          'User-Agent': 'YourApp/1.0'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return {
        latitude: data.latitude || 35.6892, // تهران به عنوان پیش‌فرض
        longitude: data.longitude || 51.3890
      };
    } catch (error) {
      console.error('Error getting location by IP:', error);
      return {
        latitude: 35.6892,
        longitude: 51.3890
      };
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
      const iranCenter: [number, number] = [32.4279, 53.6880];
      const iranZoom = 5.5;

      mapRef.current = L.map('iran-map', {
        zoomControl: false,
        minZoom: 5,
        maxZoom: 18,
      }).setView(iranCenter, iranZoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);


      // کنترل سفارشی
      const customControl = new L.Control({ position: 'bottomright' });

      customControl.onAdd = () => {
        const container = L.DomUtil.create('div');
        container.className = 'leaflet-bar-custom';

        // دکمه مکان‌یاب
        const locationBtn = L.DomUtil.create('button', 'custom-btn', container);
        locationBtn.title = 'مکان‌یاب';
        locationBtn.innerHTML = `<img src="./location.png" width="24" height="24" alt="locate" />`;

        // اضافه کردن event listener برای دکمه لوکیشن
        locationBtn.onclick = async () => {
          try {
            // اول سعی می‌کنیم موقعیت دقیق را بگیریم
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                async (position) => {
                  const { latitude, longitude } = position.coords;
                  const userLocation: [number, number] = [latitude, longitude];

                  if (markerRef.current) {
                    mapRef.current?.removeLayer(markerRef.current);
                  }

                  markerRef.current = L.marker(userLocation).addTo(mapRef.current!);
                  mapRef.current?.setView(userLocation, 15);
                  markerRef.current.bindPopup("موقعیت دقیق شما").openPopup();
                },
                async (error) => {
                  // اگر موقعیت دقیق نشد، از IP استفاده می‌کنیم
                  console.log('Using IP-based location as fallback');
                  const { latitude, longitude } = await getLocationByIP();
                  const userLocation: [number, number] = [latitude, longitude];

                  if (markerRef.current) {
                    mapRef.current?.removeLayer(markerRef.current);
                  }

                  markerRef.current = L.marker(userLocation).addTo(mapRef.current!);
                  mapRef.current?.setView(userLocation, 15);
                  markerRef.current.bindPopup("موقعیت شما (تخمین از IP)").openPopup();
                }
              );
            } else {
              // اگر مرورگر از geolocation پشتیبانی نمی‌کند
              const { latitude, longitude } = await getLocationByIP();
              const userLocation: [number, number] = [latitude, longitude];

              if (markerRef.current) {
                mapRef.current?.removeLayer(markerRef.current);
              }

              markerRef.current = L.marker(userLocation).addTo(mapRef.current!);
              mapRef.current?.setView(userLocation, 15);
              markerRef.current.bindPopup("موقعیت شما (تخمین از IP)").openPopup();
            }
          } catch (error) {
            alert('خطا در دریافت موقعیت. لطفاً دوباره امتحان کنید.');
          }
        };

        // بقیه کدها بدون تغییر...
        // باکس زوم
        const zoomBox = L.DomUtil.create('div', 'zoom-box', container);

        // بخش زوم‌این
        const zoomInSection = L.DomUtil.create('div', 'zoom-section', zoomBox);
        const zoomInBtn = L.DomUtil.create('button', 'zoom-btn', zoomInSection);
        zoomInBtn.title = 'بزرگ‌نمایی';
        const imagePlus = L.DomUtil.create('img', 'zoom-btn', zoomInBtn);
        imagePlus.src = "./plus.png";
        zoomInBtn.onclick = () => mapRef.current?.zoomIn();

        // خط جداکننده
        L.DomUtil.create('div', 'divider', zoomBox);

        // بخش زوم‌اوت
        const zoomOutSection = L.DomUtil.create('div', 'zoom-section', zoomBox);
        const zoomOutBtn = L.DomUtil.create('button', 'zoom-btn', zoomOutSection);
        zoomOutBtn.title = 'کوچک‌نمایی';
        const image = L.DomUtil.create('img', 'zoom-btn', zoomOutBtn);
        image.src = "./minus.png";
        zoomOutBtn.onclick = () => mapRef.current?.zoomOut();

        return container;
      };

      customControl.addTo(mapRef.current);

      const iranBounds = L.latLngBounds([25.0, 44.0], [40.0, 64.0]);
      mapRef.current.setMaxBounds(iranBounds);
    }
  }, []);

  return (
    <>
      <div
        id="iran-map"
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: -10,
          backgroundColor: '#f3f4f6',
        }}
      />


      <style jsx global>{`
  /* استایل‌های پایه برای کنترل‌های سفارشی */
  .leaflet-bar-custom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: transparent;
    padding: 4px;
  }

  /* دکمه مکان‌یاب */
  .leaflet-bar-custom .custom-btn {
    width: 48px;
    height: 48px;
    margin: 0;
    border-radius: 24px;
    background-color: #fefaf8;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .leaflet-bar-custom .custom-btn:hover {
    background-color: #f2ece8;
  }

  .leaflet-bar-custom .custom-btn img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  /* باکس زوم */
  .leaflet-bar-custom .zoom-box {
    width: 48px;
    height: 96px;
    border-radius: 24px;
    background-color: #fefaf8;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    overflow: hidden;
  }

  /* بخش‌های زوم */
  .leaflet-bar-custom .zoom-section {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    width: 100%;
  }

  /* جداکننده */
  .leaflet-bar-custom .divider {
    width: 60%;
    height: 1px;
    background-color: #e0e0e0;
    margin: 0 auto;
  }

  /* دکمه‌های زوم */
  .leaflet-bar-custom .zoom-btn {
    width: 100%;
    height: 40px;
    margin: 0;
    background-color: transparent;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .leaflet-bar-custom .zoom-btn:hover {
    background-color: #f2ece8;
  }

  .leaflet-bar-custom .zoom-btn img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`}</style>
    </>
  );
}