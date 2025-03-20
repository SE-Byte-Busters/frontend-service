import React from 'react';

interface MaterialSymbolProps {
    name: string;
    className?: string;
}

const MaterialSymbol: React.FC<MaterialSymbolProps> = ({ name, className = '' }) => {
    return (
        <span className={`material-symbols-outlined ${className}`}>{name}</span>
    );
};

export default MaterialSymbol;
