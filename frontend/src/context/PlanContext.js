// PlanContext.js
import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [savedCrops, setSavedCrops] = useState(() => {
    const stored = localStorage.getItem('savedCrops');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedCrops', JSON.stringify(savedCrops));
  }, [savedCrops]);

  const addCrop = (crop) => {
    setSavedCrops((prev) => {
      // avoid duplicate by name
      const exists = prev.find((c) => c.name === crop.name);
      if (exists) return prev;
      return [...prev, crop];
    });
  };

  const removeCrop = (name) => {
    setSavedCrops((prev) => prev.filter((c) => c.name !== name));
  };

  // Promote a crop to be the active (first) crop
  const setActiveCrop = (name) => {
    setSavedCrops((prev) => {
      const index = prev.findIndex((c) => c.name === name);
      if (index <= 0) return prev; // already first or not found
      const selected = prev[index];
      const newOrder = [selected, ...prev.slice(0, index), ...prev.slice(index + 1)];
      return newOrder;
    });
  };

  return (
    <PlanContext.Provider value={{ savedCrops, addCrop, removeCrop, setActiveCrop }}>
      {children}
    </PlanContext.Provider>
  );
}; 