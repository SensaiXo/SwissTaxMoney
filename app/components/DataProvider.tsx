'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchCofogData, getAvailableYears, type CofogRow } from '../lib/data';

interface DataContextType {
  data: CofogRow[];
  years: number[];
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  data: [],
  years: [],
  loading: true,
  error: null,
});

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataContextType>({
    data: [],
    years: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchCofogData()
      .then((data) => {
        setState({
          data,
          years: getAvailableYears(data),
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        setState({
          data: [],
          years: [],
          loading: false,
          error: err.message,
        });
      });
  }, []);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-[#8B2D1E] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Loading data from the Federal Statistical Office...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800">
          <p className="font-semibold mb-2">Could not load data</p>
          <p className="text-sm">{state.error}</p>
          <p className="text-sm mt-2">
            The BFS data server may be temporarily unavailable.{' '}
            <button onClick={() => window.location.reload()} className="underline font-medium">
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>;
}
