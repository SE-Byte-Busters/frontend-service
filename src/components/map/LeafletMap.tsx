'use client';

import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Popup } from 'react-leaflet';
import { useReport } from '@/context/ ReportContext';

import { useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { Icon } from '@/components/Icon';
import { customSchema } from '@hookform/resolvers/standard-schema/src/__tests__/__fixtures__/data.js';
import ReportForm from './ReportForm';
import HeaderMap from './HeaderMap';
import UnSolvedProblemForm from './UnSolvedProblemForm';

const customIconNeedle = new L.Icon({
  iconUrl: '/images/icons/needle.png', // مسیر عکس از public
  iconSize: [55, 55],          // اندازه دلخواه
  iconAnchor: [17, 35],        // نقطه نوک آیکن
  popupAnchor: [0, -35],       // موقعیت پاپ‌آپ
});

const customIconRedNeedle = new L.Icon({
  iconUrl: '/images/icons/redNeedle.png', // مسیر عکس از public
  iconSize: [55, 55],          // اندازه دلخواه
  iconAnchor: [17, 35],        // نقطه نوک آیکن
  popupAnchor: [0, -35],       // موقعیت پاپ‌آپ
});
const customIconGreenNeedle = new L.Icon({
  iconUrl: '/images/icons/greenNeedle.png', // مسیر عکس از public
  iconSize: [55, 55],          // اندازه دلخواه
  iconAnchor: [17, 35],        // نقطه نوک آیکن
  popupAnchor: [0, -35],       // موقعیت پاپ‌آپ
});
// داده‌های ماک که نشان‌دهنده مکان‌های ثبت‌شده در تهران هستند
const savedLocations = [
  { latitude: 35.6892, longitude: 51.3890, label: "مکان 1", solved: "yes" },
  { latitude: 35.7023, longitude: 51.3510, label: "مکان 2", solved: "yes" },
  { latitude: 35.7310, longitude: 51.3890, label: "مکان 3", solved: "yes" },
  { latitude: 35.7110, longitude: 51.3890, label: "مکان 4", solved: "no" },
  { latitude: 35.7110, longitude: 51.3790, label: "مکان 5", solved: "no" },
  // اضافه کردن مکان‌های بیشتر به همین شکل
];

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
      <Icon name="Locate" className="rounded-full text-black" />
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
        <Icon name="Plus" className="rounded-full text-black" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-12 h-12 rounded-full bg-[#fefaf8] shadow-md flex items-center justify-center hover:bg-[#f2ece8] transition"
      >
        <Icon name="Minus" className="rounded-full text-black" />
      </button>
    </div>
  );
};
const ReportFormWithButton = ({ }) => {
  const { isVisible, setIsVisible } = useReport();


  const toggleForm = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div
        onClick={toggleForm}
        className={`absolute top-1/2 ${!isVisible ? "left-[50%]" : "left-0"} transform -translate-y-1/2 z-20 cursor-pointer transition-all duration-500`}
        style={{ transform: `${!isVisible ? "translateY(-50%)" : "translateY(-50%) rotateY(180deg)"}` }}
      >
        <Image
          src='/images/icons/cross.png'
          alt={isVisible ? 'بستن فرم' : 'نمایش فرم'}
          width={48}
          height={61}
        />
      </div>


      {/* ReportForm */}
      <div
        className={`w-[50%] fixed top-0 left-0 z-10 bg-white shadow-lg rounded-lg transition-all duration-500 ${!isVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* محتویات فرم شما در اینجا */}
        <ReportForm />
      </div>
    </div >
  );
};
const UnSolvedProblemFormWithLocation = ({ }) => {
  const { isVisible, setIsVisible } = useReport();


  const toggleForm = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div
        onClick={toggleForm}
        className={`absolute top-1/2 ${!isVisible ? "left-[50%]" : "left-0"} transform -translate-y-1/2 z-20 cursor-pointer transition-all duration-500`}
        style={{ transform: `${!isVisible ? "translateY(-50%)" : "translateY(-50%) rotateY(180deg)"}` }}
      >
        <Image
          src='/images/icons/crossRed.png'
          alt={isVisible ? 'بستن فرم' : 'نمایش فرم'}
          width={48}
          height={61}
        />
      </div>
      {/* ReportForm */}
      <div
        className={`w-[50%] fixed top-0 left-0 z-10 bg-white shadow-lg rounded-lg transition-all duration-500 ${!isVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* محتویات فرم شما در اینجا */}
        <UnSolvedProblemForm />
      </div>
    </div >
  );
};
const FlyToPosition = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  map.flyTo([position[0] - 0.005, position[1] - 0.005], 16, { duration: 1.5 });
  return null;
};

const IranMap = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [popupText, setPopupText] = useState<string>('');
  const { isLocatedNeedle, setIsLocatedNeedle } = useReport();
  const { isVisible, setIsVisible } = useReport();
  const [problemUnSolved, setProblemUnSolved] = useState(false);
  const [problemSolved, setProblemSolved] = useState(false);
  const [showUnSolvedProblemForm, setShowUnSolvedProblemForm] = useState(false);



  const iranCenter: [number, number] = [32.4279, 53.6880];

  const setUserPosition = (pos: [number, number], text: string) => {
    setPosition(pos);
    setPopupText(text);
  };



  const [isReporting, setIsReporting] = useState(false);

  return (
    <div className="relative w-full h-screen">
      <div
        className={`w-[50%] absolute top-2 z-10 bg-white shadow-lg rounded-lg transition-all duration-500
    ${isVisible ? 'left-0 translate-x-1/2 ' : 'left-1/2 -translate-x-0'}
  `}
      >
        <HeaderMap />
      </div>
      {isLocatedNeedle ? <ReportFormWithButton /> : <></>}
      {showUnSolvedProblemForm ? <UnSolvedProblemFormWithLocation /> : <></>}

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

        {/* نشان دادن موقعیت‌های ذخیره‌شده روی نقشه */}
        {savedLocations.map((location, index) => (
          <section>
            {(problemUnSolved === true && location.solved === "no") ? <Marker key={index} position={[location.latitude, location.longitude]} icon={customIconRedNeedle} eventHandlers={{
              click: () => {
                setIsReporting(true);

                setShowUnSolvedProblemForm(true)
              },
            }}>
              <Popup>{location.label}</Popup>
            </Marker> : <></>}{
              (problemSolved === true && location.solved === "yes") ? <Marker key={index} position={[location.latitude, location.longitude]} icon={customIconGreenNeedle} eventHandlers={{
                click: () => {
                  alert(location)
                },
              }}>
                <Popup>{location.label}</Popup>
              </Marker> : <></>}


          </section>

        ))}

        {position && (
          <Marker position={position} icon={customIconNeedle}>
            <Popup>{popupText}</Popup>
          </Marker>
        )}

        <CustomZoomControls setUserPosition={setUserPosition} />
        {isReporting && (
          <MapClickHandler onClick={(e) => {
            const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
            setUserPosition(coords, "موقعیت انتخاب شده توسط شما");
          }} />
        )}
        {isLocatedNeedle && position && <FlyToPosition position={position} />}

      </MapContainer>

      <section className="absolute top-7 right-10 w-[60px] h-[60px] bg-[#8EB486] flex justify-center items-center rounded-xl">
        <Icon name="User" />
      </section>

      {!isReporting && !isLocatedNeedle &&
        <section className="absolute bottom-5 sm:bottom-10 w-full flex justify-center items-center sm:gap-8 gap-3 z-10 flex-col sm:flex-row text-center">
          <button onClick={() => {
            setProblemSolved(!problemSolved)
          }}
            className="w-[200px]  bg-[#00E083] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition  text-black">
            مشکلات حل شده
          </button>
          <button onClick={() => {
            setProblemUnSolved(!problemUnSolved)

          }} className="w-[200px]  bg-[#F45151] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition  text-black">
            مشکلات حل نشده
          </button>
          <button
            onClick={() => setIsReporting(true)}
            className="w-[200px]  bg-[#F48B11] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition  text-black"
          >
            ثبت گزارش جدید
          </button>
        </section>
      }

      {isReporting && position && (
        <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
          <button
            onClick={() => {
              alert(`مکان ثبت شد: ${position[0]}, ${position[1]}`);
              setIsLocatedNeedle(true);

              setIsReporting(false);
            }}
            className="bg-green-600 text-white px-6 py-2 rounded-xl shadow"
          >
            ثبت مکان گزارش
          </button>
          <button
            onClick={() => {
              setIsReporting(false);
              setPosition(null);
              setPopupText('');
            }}
            className="bg-transparent border-0 p-0"
          >
            <Image
              src="/images/icons/X.png"  // مسیر تصویر لغو
              alt="Background Image"
              width={64}
              height={64}
              className="w-10 h-10"  // سایز دلخواه برای عکس
            />
          </button>
        </div>
      )}

    </div>
  );
};

const MapClickHandler = ({ onClick }: { onClick: (e: L.LeafletMouseEvent) => void }) => {
  useMap().on('click', onClick);
  return null;
};

export default IranMap;
