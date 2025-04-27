import React, { createContext, useContext, useState } from 'react';

type AlertType = {
    type: string;
    message: string;
};

type ReportContextType = {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
    isLocatedNeedle: boolean;
    setIsLocatedNeedle: (value: boolean) => void;
    showNeedleOrange: boolean;
    setShowNeedleOrange: (value: boolean) => void;
    imagesToSend: File[];
    setImagesToSend: (value: File[]) => void;
    position: [number, number] | null;
    setPosition: (value: [number, number] | null) => void;
    alert: AlertType;
    setAlert: (value: AlertType) => void;
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

// Provider
export const ReportProvider = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isLocatedNeedle, setIsLocatedNeedle] = useState(false);
    const [showNeedleOrange, setShowNeedleOrange] = useState(false);
    const [imagesToSend, setImagesToSend] = useState<File[]>([]);
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [alert, setAlert] = useState<AlertType>({ type: '', message: '' });

    return (
        <ReportContext.Provider value={{
            isVisible,
            setIsVisible,
            isLocatedNeedle,
            setIsLocatedNeedle,
            showNeedleOrange,
            setShowNeedleOrange,
            imagesToSend,
            setImagesToSend,
            position,
            setPosition,
            alert,
            setAlert,
        }}>
            {children}
        </ReportContext.Provider>
    );
};

// هوک برای استفاده راحت در کامپوننت‌ها
export const useReport = () => {
    const context = useContext(ReportContext);
    if (!context) {
        throw new Error('useReport باید داخل ReportProvider استفاده شود');
    }
    return context;
};