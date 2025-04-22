'use client';

import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Popup } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { Icon } from '@/components/Icon';

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
    <button
      onClick={handleClick}
      className="w-12 h-12 rounded-full bg-[#fefaf8] shadow-md flex items-center justify-center hover:bg-[#f2ece8] transition"
    >
      <Image
        src="/ipMap.png"
        alt="ip"
        width={20}
        height={20}
        className="rounded-full"
      />
    </button>
  );
};
const CustomZoomControls = ({ setUserPosition }: { setUserPosition: (pos: [number, number], msg: string) => void }) => {
  const map = useMap();

  return (
    <div className="absolute sm:bottom-10 bottom-5 right-3 z-[1000] flex flex-col gap-2 ">
      <LocateButton setUserPosition={setUserPosition} />

      <button
        onClick={() => map.zoomIn()}
        className="w-12 h-12 rounded-full bg-[#fefaf8] shadow-md flex items-center justify-center hover:bg-[#f2ece8] transition"
      >
        <Image
          src="/plusMap.png"
          alt="plus"
          width={20}
          height={20}
          className="rounded-full"
        />

      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-12 h-12 rounded-full bg-[#fefaf8] shadow-md flex items-center justify-center hover:bg-[#f2ece8] transition"
      >
        <Image
          src="/minusMap.png"
          alt="minus"
          width={20}
          height={20}
          className="rounded-full"
        />

        <Icon name="MapPin" className="w-6 h-6 object-contain text-black" />
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


        {position && (
          <Marker position={position}>
            <Popup>{popupText}</Popup>
          </Marker>
        )}

        <CustomZoomControls setUserPosition={setUserPosition} />
      </MapContainer>
      <section className="absolute top-7 right-10 w-[60px] h-[60px] bg-[#8EB486] flex justify-center rounded-xl">
        <Image
          src="/User.png"
          alt="User"
          width={25}
          height={25}
        />
      </section>

      {/* دکمه‌های پایین صفحه */}
      <section className="absolute bottom-5 sm:bottom-10 w-full flex justify-center items-center sm:gap-8 gap-3 z-10 flex-col sm:flex-row text-center">
        <button className="w-[200px]  bg-[#00E083] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition  text-black">
          مشکلات حل شده
        </button>
        <button className="w-[200px]  bg-[#F45151] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition  text-black">
          مشکلات حل نشده
        </button>
        <button className="w-[200px]  bg-[#F48B11] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition  text-black">
          ثبت گزارش جدید
        </button>
      </section>
    </div>
  );
};

export default IranMap;
