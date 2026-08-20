'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
  resolveLocation, setStoredLocation, FALLBACK_LOCATION,
  type LocationData,
} from '@/src/lib/utils/location';

interface LocationContextType {
  location:    LocationData & { source: string };
  setLocation: (loc: LocationData & { source?: string }) => void;
  detecting:   boolean;
}

const DEFAULT_CTX: LocationContextType = {
  location:    { ...FALLBACK_LOCATION, source: 'fallback' },
  setLocation: () => {},
  detecting:   true,
};

const LocationContext = createContext<LocationContextType>(DEFAULT_CTX);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<LocationData & { source: string }>(
    { ...FALLBACK_LOCATION, source: 'fallback' }
  );
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    resolveLocation().then(loc => {
      setLocationState(loc);
      setDetecting(false);
    });
  }, []);

  const setLocation = (loc: LocationData & { source?: string }) => {
    const tagged = { ...loc, source: loc.source ?? 'manual' };
    setLocationState(tagged);
    setStoredLocation(tagged);
    // Notify other components
    window.dispatchEvent(new CustomEvent('vedrith:locationChange', { detail: tagged }));
  };

  return (
    <LocationContext.Provider value={{ location, setLocation, detecting }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextType {
  return useContext(LocationContext);
}
