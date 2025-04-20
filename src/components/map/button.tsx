// components/MapWithButtons.tsx
'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';

const MapWithButtons = () => {
    return (
        <div style={{ height: '100vh', position: 'relative' }}>
            {/* نقشه */}
            <MapContainer
                center={[35.6892, 51.3890]} // تهران
                zoom={13}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>

            {/* دکمه‌ها */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                display: 'flex',
                gap: '10px',
                flexDirection: 'row'
            }}>
                <button style={{
                    backgroundColor: '#ffa726',
                    color: '#000',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>ثبت گزارش جدید</button>

                <button style={{
                    backgroundColor: '#ef5350',
                    color: '#000',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>مشکلات حل نشده</button>

                <button style={{
                    backgroundColor: '#26c6da',
                    color: '#000',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '10px 20px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}>مشکلات حل شده</button>
            </div>
        </div>
    );
};

export default MapWithButtons;
