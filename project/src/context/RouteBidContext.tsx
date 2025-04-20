import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Route, Bid } from '@/lib/types';
import { mockRoutes } from '@/lib/mockData';

// Types for context
interface RouteBidContextType {
  routes: Route[];
  setRoutes: React.Dispatch<React.SetStateAction<Route[]>>;
  bids: Bid[];
  setBids: React.Dispatch<React.SetStateAction<Bid[]>>;
}

const RouteBidContext = createContext<RouteBidContextType | undefined>(undefined);

export const useRouteBidContext = () => {
  const ctx = useContext(RouteBidContext);
  if (!ctx) throw new Error('useRouteBidContext must be used within RouteBidProvider');
  return ctx;
};

export const RouteBidProvider = ({ children }: { children: ReactNode }) => {
  const [routes, setRoutes] = useState<Route[]>(mockRoutes);
  const [bids, setBids] = useState<Bid[]>([]);

  return (
    <RouteBidContext.Provider value={{ routes, setRoutes, bids, setBids }}>
      {children}
    </RouteBidContext.Provider>
  );
};
