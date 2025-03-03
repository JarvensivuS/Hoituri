// components/HomeContext.tsx
import React, { createContext, useState, ReactNode } from "react";

interface HomeContextProps {
  homeSet: boolean;
  homeLocation: { latitude: number; longitude: number } | null;
  setHomeSet: (value: boolean) => void;
  setHomeLocation: (location: { latitude: number; longitude: number } | null) => void;
}

export const HomeContext = createContext<HomeContextProps>({
  homeSet: false,
  homeLocation: null,
  setHomeSet: () => {},
  setHomeLocation: () => {},
});

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [homeSet, setHomeSet] = useState(false);
  const [homeLocation, setHomeLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  return (
    <HomeContext.Provider value={{ homeSet, homeLocation, setHomeSet, setHomeLocation }}>
      {children}
    </HomeContext.Provider>
  );
};
