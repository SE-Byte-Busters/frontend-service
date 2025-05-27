'use client';

import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Popup } from 'react-leaflet';
import { useReport } from '@/context/ReportContext';
import { useState, useEffect, useCallback, useRef } from 'react';
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
import { Report, ReportsResponse } from '@/components/report/ReportTypes'

const customIconNeedle = new L.Icon({
  iconUrl: '/images/icons/needle.png',
  iconSize: [55, 55],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const customIconRedNeedle = new L.Icon({
  iconUrl: '/images/icons/redNeedle.png',
  iconSize: [55, 55],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const customIconGreenNeedle = new L.Icon({
  iconUrl: '/images/icons/greenNeedle.png',
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
    <div className="absolute sm:bottom-10 bottom-5 right-3 z-[1000] flex flex-col gap-2">
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

const ReportFormWithButton = () => {
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
      <div
        className={`w-[50%] fixed top-0 left-0 z-10 bg-white shadow-lg rounded-lg transition-all duration-500 ${!isVisible ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <ReportForm />
      </div>
    </div>
  );
};

interface UnSolvedProblemFormWithLocationProps {
  selectedReportId: string | null;
}

const UnSolvedProblemFormWithLocation: React.FC<UnSolvedProblemFormWithLocationProps> = ({ selectedReportId }) => {
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
      <div
        className={`w-[50%] fixed top-0 left-0 z-10 bg-white shadow-lg rounded-lg transition-all duration-500 ${!isVisible ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <UnSolvedProblemForm reportId={selectedReportId || undefined} />
      </div>
    </div>
  );
};

interface SolvedProblemFormWithLocationProps {
  selectedReportId: string | null;
}

const SolvedProblemFormWithLocation: React.FC<SolvedProblemFormWithLocationProps> = ({ selectedReportId }) => {
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
      <div
        className={`w-[50%] fixed top-0 left-0 z-10 bg-white shadow-lg rounded-lg transition-all duration-500 ${!isVisible ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <UnSolvedProblemForm reportId={selectedReportId || undefined} />
      </div>
    </div>
  );
};

const FlyToPosition = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  map.flyTo([position[0] - 0.005, position[1] - 0.005], 16, { duration: 1.5 });
  return null;
};

const MapClickHandler = ({ onClick }: { onClick: (e: L.LeafletMouseEvent) => void }) => {
  useMap().on('click', onClick);
  return null;
};

const MapBoundsHandler = ({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds, zoom: number) => void }) => {
  const map = useMap();

  useEffect(() => {
    const handleViewChange = () => {
      const bounds = map.getBounds();
      const zoom = map.getZoom();
      onBoundsChange(bounds, zoom);
    };

    map.on('moveend', handleViewChange);
    map.on('zoomend', handleViewChange);

    handleViewChange();

    return () => {
      map.off('moveend', handleViewChange);
      map.off('zoomend', handleViewChange);
    };
  }, [map, onBoundsChange]);

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
  const iranCenter: [number, number] = [35.6892, 51.3890];
  const { isReporting, setIsReporting } = useReport();
  const [reportLocations, setReportLocations] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBounds, setCurrentBounds] = useState<L.LatLngBounds | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(11);
  const lastFetchRef = useRef<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const fetchReports = useCallback(async (bounds: L.LatLngBounds, zoom: number, filter: string = 'all') => {
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const requestKey = `${ne.lat}-${ne.lng}-${sw.lat}-${sw.lng}-${zoom}-${filter}`;
    if (requestKey === lastFetchRef.current) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    lastFetchRef.current = requestKey;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        neLat: ne.lat.toString(),
        neLng: ne.lng.toString(),
        swLat: sw.lat.toString(),
        swLng: sw.lng.toString(),
        filter,
        zoom: zoom.toString()
      });

      const token = localStorage.getItem('token');
      const response = await fetch(
        `https://shahriar.thetechverse.ir:3000/api/v1/report/map-search?${params}`,
        {
          method: 'GET',
          signal: abortControllerRef.current.signal,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReportsResponse = await response.json();

      if (requestKey === lastFetchRef.current) {
        setReportLocations(data.reports || []);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      if (requestKey === lastFetchRef.current) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setReportLocations([]);
      }
    } finally {
      if (requestKey === lastFetchRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const handleBoundsChange = useCallback(
    (bounds: L.LatLngBounds, zoom: number) => {
      setCurrentBounds(bounds);
      setCurrentZoom(zoom);

      let filter = 'all';
      if (problemSolved && !problemUnSolved) {
        filter = 'done';
      } else if (problemUnSolved && !problemSolved) {
        filter = 'notDone';
      }

      const timeoutId = setTimeout(() => {
        fetchReports(bounds, zoom, filter);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [fetchReports, problemSolved, problemUnSolved]
  );

  useEffect(() => {
    if (currentBounds) {
      let filter = 'all';
      if (problemSolved && !problemUnSolved) {
        filter = 'done';
      } else if (problemUnSolved && !problemSolved) {
        filter = 'notDone';
      }

      fetchReports(currentBounds, currentZoom, filter);
    }
  }, [problemSolved, problemUnSolved, currentBounds, currentZoom, fetchReports]);

  const getMarkerIcon = (report: Report) => {
    if (report.status === 2) {
      return customIconGreenNeedle;
    } else if (report.status === 0 || report.status === 1) {
      return customIconRedNeedle;
    }
    return customIconNeedle;
  };

  const shouldShowReport = (report: Report) => {
    if (problemSolved && !problemUnSolved) {
      return report.status === 2;
    } else if (problemUnSolved && !problemSolved) {
      return report.status === 0 || report.status === 1;
    }
    return true;
  };

  const setUserPosition = (pos: [number, number], text: string) => {
    setPosition(pos);
    setPopupText(text);
  };

  const handleReportClick = (report: Report) => {
    setIsReporting(true);
    setPosition([report.location.coordinates[1], report.location.coordinates[0]]);
    setSelectedReportId(report._id);

    if (report.status === 2) {
      setShowSolvedProblemForm(true);
      setProblemSolved(true);
    } else {
      setShowUnSolvedProblemForm(true);
      setProblemUnSolved(true);
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div
        className={`w-[50%] absolute top-2 z-10 bg-white shadow-lg rounded-lg transition-all duration-500
      ${isVisible ? 'left-0 translate-x-1/2 ' : 'left-1/2 -translate-x-0'}`}
      >
        <HeaderMap />
      </div>
      {isLocatedNeedle && <ReportFormWithButton />}
      {showUnSolvedProblemForm && <UnSolvedProblemFormWithLocation selectedReportId={selectedReportId}/>}
      {showSolvedProblemForm && <SolvedProblemFormWithLocation selectedReportId={selectedReportId}/>}

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
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Map bounds handler for API calls */}
        <MapBoundsHandler onBoundsChange={handleBoundsChange} />

        {/* Render markers from API */}
        {reportLocations
          .filter(shouldShowReport)
          .map((report) => (
            <Marker
              key={report._id}
              position={[report.location.coordinates[1], report.location.coordinates[0]]}
              icon={getMarkerIcon(report)}
              eventHandlers={{
                click: () => handleReportClick(report),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm mb-1">{report.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                  {report.city && <p className="text-xs text-gray-500">📍 {report.city}</p>}
                  <p className="text-xs text-gray-500">
                    وضعیت: {report.status === 0 ? 'جدید' : report.status === 1 ? 'در حال بررسی' : report.status === 2 ? 'حل شده' : 'رد شده'}
                  </p>
                  {report.images && report.images.length > 0 && (
                    <div className="mt-2">
                      <img
                        src={report.images[0].url}
                        alt="Report"
                        className="w-full h-20 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

        {position && showNeedleOrange && (
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
        {(showUnSolvedProblemForm || showSolvedProblemForm) && position && <FlyToPosition position={position} />}
      </MapContainer>

      <section className="absolute top-7 right-10 w-[60px] h-[60px] bg-[#8EB486] flex justify-center items-center rounded-xl">
        <Link href={typeof window !== 'undefined' && localStorage.getItem("role") === "user" ? "/user/profile/edit" : "/admin/profile/edit"}>
          <Icon name="User" />
        </Link>
      </section>

      {!isReporting && !isLocatedNeedle && (
        <section className="absolute bottom-5 sm:bottom-10 w-full flex justify-center items-center sm:gap-8 gap-3 z-10 flex-col sm:flex-row text-center">
          <button
            onClick={() => setProblemSolved(!problemSolved)}
            className={`w-[200px] ${problemSolved ? 'bg-[#00E083]' : 'bg-gray-300'} text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition text-black`}
          >
            مشکلات حل شده
          </button>
          <button
            onClick={() => setProblemUnSolved(!problemUnSolved)}
            className={`w-[200px] ${problemUnSolved ? 'bg-[#F45151]' : 'bg-gray-300'} text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition text-black`}
          >
            مشکلات حل نشده
          </button>
          <button
            onClick={() => {
              setIsReporting(true);
              setShowNeedleOrange(true);
            }}
            className="w-[200px] bg-[#F48B11] text-sm px-4 py-2 rounded-3xl shadow hover:bg-gray-100 transition text-black"
          >
            ثبت گزارش جدید
          </button>
        </section>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-white px-4 py-2 rounded-lg shadow-md">
          <span className="text-sm text-black">در حال بارگذاری...</span>
        </div>
      )}

      {/* Error indicator */}
      {error && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg">
          <span className="text-sm text-black">خطا: {error}</span>
        </div>
      )}

      {isReporting && position && (
        <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
          <button
            onClick={() => {
              setIsLocatedNeedle(true);
              setIsReporting(false);
            }}
            className="bg-[#F48B11] text-white px-6 py-2 rounded-xl shadow"
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
              src="/images/icons/X.png"
              alt="Background Image"
              width={64}
              height={64}
              className="w-10 h-10"
            />
          </button>
        </div>
      )}

      {showSolvedProblemForm && (
        <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
          <button
            onClick={() => setProblemSolved(!problemSolved)}
            className="bg-green-600 text-white px-6 py-2 rounded-xl shadow"
          >
            مشکلات حل شده
          </button>
          <button
            onClick={() => {
              setIsReporting(false);
              setPosition(null);
              setPopupText('');
              setProblemSolved(!problemSolved);
              setShowSolvedProblemForm(false);
            }}
            className="bg-transparent border-0 p-0"
          >
            <Image
              src="/images/icons/X.png"
              alt="Background Image"
              width={64}
              height={64}
              className="w-10 h-10"
            />
          </button>
        </div>
      )}

      {showUnSolvedProblemForm && (
        <div className="absolute bottom-10 w-full flex justify-center z-10 gap-4">
          <button
            onClick={() => setProblemUnSolved(!problemUnSolved)}
            className="bg-[#F45151] text-white px-6 py-2 rounded-xl shadow"
          >
            مشکلات حل نشده
          </button>
          <button
            onClick={() => {
              setIsReporting(false);
              setPosition(null);
              setPopupText('');
              setProblemUnSolved(!problemUnSolved);
              setShowUnSolvedProblemForm(false);
            }}
            className="bg-transparent border-0 p-0"
          >
            <Image
              src="/images/icons/X.png"
              alt="Background Image"
              width={64}
              height={64}
              className="w-10 h-10"
            />
          </button>
        </div>
      )}

      {alert && alert.message && (
        <section
          className={`fixed bottom-4 right-4 z-50
            ${alert.type === 'success' ? 'alert-success' : ''}
            ${alert.type === 'error' ? 'alert-error' : ''}`}
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
      )}
    </div>
  );
};

export default IranMap;
