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

  return (
    <PlanContext.Provider value={{ savedCrops, addCrop, removeCrop }}>
      {children}
    </PlanContext.Provider>
  );
}; 