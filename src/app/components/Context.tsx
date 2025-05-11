"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

type GlobalContextType = {
    showHeader: boolean;
    handleShowHeaqder: (val: boolean) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [showHeader, setShowHeader] = useState(true);
    const handleShowHeaqder=(vl:boolean)=>{
        setShowHeader(vl)
    }
  return (
    <GlobalContext.Provider value={{ showHeader, handleShowHeaqder }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Hook tiện dùng
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobal must be used inside GlobalProvider');
  return context;
};
