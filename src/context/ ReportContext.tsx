import React, { createContext, useContext, useState } from 'react';

type ReportContextType = {
    isVisible: boolean;
    setIsVisible: (value: boolean) => void;
    isLocatedNeedle: boolean;
    setIsLocatedNeedle: (value: boolean) => void;
};

const ReportContext = createContext<ReportContextType | undefined>(undefined);

// Provider
export const ReportProvider = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isLocatedNeedle, setIsLocatedNeedle] = useState(false);



    return (
        <ReportContext.Provider value={{ isVisible, setIsVisible, isLocatedNeedle, setIsLocatedNeedle }}>
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