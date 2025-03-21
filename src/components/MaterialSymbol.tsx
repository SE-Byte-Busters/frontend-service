import React, { CSSProperties } from 'react';

interface MaterialSymbolProps {
  name: string;
  type?: string;
  className?: string;
  style?: CSSProperties;
}

const MaterialSymbol: React.FC<MaterialSymbolProps> = ({ name, type = 'outlined', className = '', style = {} }) => {
  return (
    <span className={`material-symbols-${type} ${className}`} style={style}>
      {name}
    </span>
  );
};

export default MaterialSymbol;
