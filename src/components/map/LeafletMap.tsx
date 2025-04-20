'use client';

import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Popup } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const getLocationByIP = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      latitude: data.latitude || 35.6892,
      longitude: data.longitude || 51.3890,
    };
  } catch {
    return {
      latitude: 35.6892,
      longitude: 51.3890,
    };
  }
};

const LocateButton = ({ setUserPosition }: { setUserPosition: (pos: [number, number], msg: string) => void }) => {
  const map = useMap();

  const handleClick = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserPosition(coords, "موقعیت دقیق شما");
          map.setView(coords, 15);
        },
        async () => {
          const { latitude, longitude } = await getLocationByIP();
          const coords: [number, number] = [latitude, longitude];
          setUserPosition(coords, "موقعیت شما (تخمین از IP)");
          map.setView(coords, 15);
        }
      );
    } else {
      const { latitude, longitude } = await getLocationByIP();
      const coords: [number, number] = [latitude, longitude];
      setUserPosition(coords, "موقعیت شما (تخمین از IP)");
      map.setView(coords, 15);
    }
  };

  return (
    <div className="absolute bottom-28 right-3 z-[1000]">
      <button
        onClick={handleClick}
        className="w-12 h-12 rounded-full bg-[#fefaf8] shadow-md flex items-center justify-center hover:bg-[#f2ece8] transition"
      >
        <img src="/location.png" alt="locate" className="w-6 h-6 object-contain" />
      </button>
    </div>
  );
};

const IranMap = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [popupText, setPopupText] = useState<string>('');

  const iranCenter: [number, number] = [32.4279, 53.6880];

  const setUserPosition = (pos: [number, number], text: string) => {
    setPosition(pos);
    setPopupText(text);
  };

  return (
    <div className="relative w-full h-screen">
      <MapContainer
        center={iranCenter}
        zoom={5.5}
        minZoom={5}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom
        className="w-full h-full z-0"
        maxBounds={L.latLngBounds([25.0, 44.0], [40.0, 64.0])}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <LocateButton setUserPosition={setUserPosition} />

        {position && (
          <Marker position={position}>
            <Popup>{popupText}</Popup>
          </Marker>
        )}

        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* دکمه‌های پایین صفحه */}
      <div className="absolute bottom-4 w-full flex justify-center gap-8 z-[1000]">
        <button className="bg-[#00E083] text-sm px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition  text-black">
          مشکلات حل شده
        </button>
        <button className="bg-[#F45151] text-sm px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition  text-black">
          مشکلات حل نشده
        </button>
        <button className="bg-[#F48B11] text-sm px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition  text-black">
          ثبت گزارش جدید
        </button>
      </div>
    </div>
  );
};

export default IranMap;
