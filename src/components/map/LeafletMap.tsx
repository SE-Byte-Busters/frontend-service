'use client';

import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Popup } from 'react-leaflet';
import { useReport } from '@/context/ ReportContext';

import { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Image from 'next/image';
import { Icon } from '@/components/Icon';
import ReportForm from './ReportForm';
import HeaderMap from './HeaderMap';
import UnSolvedProblemForm from './UnSolvedProblemForm';
import SolvedProblemForm from './SolvedProblemForm';

import '@/app/globals.css';
import Link from 'next/link';
import { Report } from '@/components/report/ReportTypes'


const customIconNeedle = new L.Icon({
  iconUrl: '/images/icons/needle.png', // مسیر عکس از public
  iconSize: [55, 55],          // اندازه دلخواه
  iconAnchor: [17, 35],        // نقطه نوک آیکن
  popupAnchor: [0, -35],       // موقعیت پاپ‌آپ
});

const customIconRedNeedle = new L.Icon({
  iconUrl: '/images/icons/redNeedle.png', // مسیر عکس از public
  iconSize: [55, 55],          // اندازه دلخواه
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});
const customIconGreenNeedle = new L.Icon({
  iconUrl: '/images/icons/greenNeedle.png', // مسیر عکس از public
  iconSize: [55, 55],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

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
const SolvedProblemFormWithLocation = ({ }) => {
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
          src='/images/icons/crossGreen.png'
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
        <SolvedProblemForm />
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
  const { position, setPosition } = useReport();
  const [popupText, setPopupText] = useState<string>('');
  const { isLocatedNeedle, setIsLocatedNeedle } = useReport();
  const { isVisible, setIsVisible } = useReport();
  const { showNeedleOrange, setShowNeedleOrange } = useReport();

  const [problemUnSolved, setProblemUnSolved] = useState(false);
  const [problemSolved, setProblemSolved] = useState(false);
  const [showUnSolvedProblemForm, setShowUnSolvedProblemForm] = useState(false);
  const [showSolvedProblemForm, setShowSolvedProblemForm] = useState(false);
  const { alert, setAlert } = useReport();
  const [savedLocations, setSavedLocations] = useState<Report[]>([]);
  const mapRef = useRef<L.Map | null>(null);

  // get report withing current bound
  const fetchReportsInBounds = async (map: L.Map, filter: string = 'all', retryCount = 0, signal?: AbortSignal) => {
    try {
      const bounds = map.getBounds();
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/map-search?` +
        `neLat=${ne.lat}&neLng=${ne.lng}&` +
        `swLat=${sw.lat}&swLng=${sw.lng}&` +
        `filter=${filter}&` +
        `zoom=${map.getZoom()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      const data = await response.json();
      setSavedLocations(data.data);
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error fetching reports:', error);
        setAlert({
          type: 'error',
          message: 'خطا در دریافت گزارش‌ها از سرور'
        });
        setSavedLocations([]);
        throw error;
      }
    }
  };

  // Add event listener for map move
  const WhenReady = ({ children }: { children: React.ReactNode }) => {
    const map = useMap();
    const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
      const fetchWithDebounce = () => {
        // Cancel previous request and timeout
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }

        abortControllerRef.current = new AbortController();

        fetchTimeoutRef.current = setTimeout(() => {
          fetchReportsInBounds(
            map,
            problemSolved ? 'done' : problemUnSolved ? 'notDone' : 'all',
            0,
            abortControllerRef.current?.signal
          );
        }, 500);
      };

      const handleMoveEnd = () => {
        fetchWithDebounce();
      };

      // Initial fetch
      fetchWithDebounce();

      // Set up event listener
      map.on('moveend', handleMoveEnd);

      // Cleanup
      return () => {
        map.off('moveend', handleMoveEnd);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        if (fetchTimeoutRef.current) {
          clearTimeout(fetchTimeoutRef.current);
        }
      };
    }, [map, problemSolved, problemUnSolved]); // Keep these dependencies

    return children;
  };

  // Update reports when filter changes
  useEffect(() => {
    if (mapRef.current) {
      fetchReportsInBounds(
        mapRef.current,
        problemSolved ? 'done' :
        problemUnSolved ? 'notDone' :
        'all'
      );
    }
  }, [problemSolved, problemUnSolved]);

  const iranCenter: [number, number] = [35.6892, 51.3890];

  const setUserPosition = (pos: [number, number], text: string) => {
    setPosition(pos);
    setPopupText(text);
  };



  const { isReporting, setIsReporting } = useReport();

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
      {showSolvedProblemForm ? <SolvedProblemFormWithLocation /> : <></>}


      <MapContainer
        center={iranCenter}
        zoom={11}
        minZoom={5}
        maxZoom={18}
        zoomControl={false}
        scrollWheelZoom
        className="w-full h-full z-0"
        maxBounds={L.latLngBounds([25.0, 44.0], [40.0, 64.0])}
      >
        <WhenReady>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* نشان دادن موقعیت‌های ذخیره‌شده روی نقشه */}
          {savedLocations.map((location, index) => (
            <Marker
              key={index}
              position={[location.location.coordinates[0], location.location.coordinates[1]]}
              icon={location.status === 1 || location.status === 2 ?
                customIconGreenNeedle :
                customIconRedNeedle
              }
              eventHandlers={{
                click: () => {
                  setIsReporting(true);
                  setPosition([location.location.coordinates[0], location.location.coordinates[1]]);
                  if (location.status === 1 || location.status === 2) {
                    setShowSolvedProblemForm(true);
                  } else {
                    setShowUnSolvedProblemForm(true);
                  }
                },
              }}
            >
              <Popup>{location.title}</Popup>
            </Marker>
          ))}
          {
            position && showNeedleOrange && (
              <Marker position={position} icon={customIconNeedle}>
                <Popup>{popupText}</Popup>
              </Marker>
            )
          }
          <CustomZoomControls setUserPosition={setUserPosition} />
          {
            isReporting && (
              <MapClickHandler onClick={(e) => {
                const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
                setUserPosition(coords, "موقعیت انتخاب شده توسط شما");
              }} />
            )
          }
          {isLocatedNeedle && position && <FlyToPosition position={position} />}
          {(showUnSolvedProblemForm || showSolvedProblemForm) && position && <FlyToPosition position={position} />}
        </WhenReady>
      </MapContainer >

      <section className="absolute top-7 right-10 w-[60px] h-[60px] bg-[#8EB486] flex justify-center items-center rounded-xl">
        <Link href={localStorage.getItem("role") === "user" ? "/user/profile/edit" : "/admin/profile/edit"}>
          <Icon name="User" />
        </Link>
      </section>

      {
        !isReporting && !isLocatedNeedle &&
        <section className="absolute bottom-5 sm:bottom-10 w-full flex justify-center items-center sm:gap-8 gap-3 z-10 flex-col sm:flex-row text-center">
        <button
          onClick={() => {
            setProblemSolved(!problemSolved);
            setProblemUnSolved(false);
            if (mapRef.current) {
              fetchReportsInBounds(mapRef.current, problemSolved ? 'all' : 'done');
            }
          }}
          className="w-[200px] bg-[#00E083] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition text-black"
        >
          مشکلات حل شده
        </button>

        <button
          onClick={() => {
            setProblemUnSolved(!problemUnSolved);
            setProblemSolved(false);
            if (mapRef.current) {
              fetchReportsInBounds(mapRef.current, problemUnSolved ? 'all' : 'notDone');
            }
          }}
          className="w-[200px] bg-[#F45151] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition text-black"
        >
          مشکلات حل نشده
        </button>
          <button
            onClick={() => {
              setIsReporting(true)
              setShowNeedleOrange(true)
            }

            }
            className="w-[200px]  bg-[#F48B11] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition  text-black"
          >
            ثبت گزارش جدید
          </button>
        </section>
      }

      {
        isReporting && position && (
          <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
            <button
              onClick={() => {
                setIsLocatedNeedle(true);

                setIsReporting(false);
              }}
              className="bg-[#F48B11] text-white px-6 py-2 rounded-xl shadow">

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
        )
      }
      {
        showSolvedProblemForm && (
          <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
            <button
              onClick={() => {
                // alert(`مکان ثبت شد: ${position[0]}, ${position[1]}`);
                setProblemSolved(!problemSolved)

              }}
              className="bg-green-600 text-white px-6 py-2 rounded-xl shadow"
            >
              مشکلات حل شده
            </button>
            <button
              onClick={() => {
                setIsReporting(false);
                setPosition(null);
                setPopupText('');
                setProblemSolved(!problemSolved)

                setShowSolvedProblemForm(false);
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
        )
      }
      {
        showUnSolvedProblemForm && (
          <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
            <button
              onClick={() => {
                // alert(`مکان ثبت شد: ${position[0]}, ${position[1]}`);
                setProblemUnSolved(!problemUnSolved)

              }}
              className="bg-[#F45151] text-white px-6 py-2 rounded-xl shadow"
            >
              مشکلات حل نشده
            </button>
            <button
              onClick={() => {
                setIsReporting(false);
                setPosition(null);
                setPopupText('');
                setProblemUnSolved(!problemUnSolved)

                setShowUnSolvedProblemForm(false);
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
        )
      }
      {alert &&
        alert.message && (
          <section
            className={`fixed bottom-4 right-4 z-50
      ${alert.type === 'success' ? 'alert-success' : ''}
      ${alert.type === 'error' ? 'alert-error' : ''}
    `}
            role="alert"
          >
            <span>{alert.message}</span>
            {alert.type === 'success' && (
              <svg className="icon-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {alert.type === 'error' && (
              <svg className="icon-error" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.597c.75 1.334-.214 2.995-1.743 2.995H3.482c-1.53 0-2.493-1.661-1.743-2.995L8.257 3.1z" clipRule="evenodd" />
              </svg>
            )}
          </section>
        )
      }
      {
        showSolvedProblemForm && (
          <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
            <button
              onClick={() => {
                // alert(`مکان ثبت شد: ${position[0]}, ${position[1]}`);
                setProblemSolved(!problemSolved)

              }}
              className="bg-green-600 text-white px-6 py-2 rounded-xl shadow"
            >
              مشکلات حل شده
            </button>
            <button
              onClick={() => {
                setIsReporting(false);
                setPosition(null);
                setPopupText('');
                setProblemSolved(!problemSolved)

                setShowSolvedProblemForm(false);
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
        )
      }
      {
        showUnSolvedProblemForm && (
          <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
            <button
              onClick={() => {
                // alert(`مکان ثبت شد: ${position[0]}, ${position[1]}`);
                setProblemUnSolved(!problemUnSolved)

              }}
              className="bg-[#F45151] text-white px-6 py-2 rounded-xl shadow"
            >
              مشکلات حل نشده
            </button>
            <button
              onClick={() => {
                setIsReporting(false);
                setPosition(null);
                setPopupText('');
                setProblemUnSolved(!problemUnSolved)

                setShowUnSolvedProblemForm(false);
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
        )
      }

    </div >
  );
};

const MapClickHandler = ({ onClick }: { onClick: (e: L.LeafletMouseEvent) => void }) => {
  useMap().on('click', onClick);
  return null;
};

export default IranMap;
