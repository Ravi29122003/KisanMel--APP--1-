import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Scope localStorage key to user ID so each farmer has their own plan
  const storageKey = user?._id ? `savedCrops_${user._id}` : 'savedCrops_guest';

  const [savedCrops, setSavedCrops] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });

  // Re-initialize savedCrops when user changes (login/logout)
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    setSavedCrops(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(savedCrops));
  }, [savedCrops, storageKey]);

  const addCrop = (crop) => {
    setSavedCrops((prev) => {
      const exists = prev.find((c) => c.name === crop.name);
      if (exists) return prev;
      return [...prev, crop];
    });
  };

  const removeCrop = (name) => {
    setSavedCrops((prev) => prev.filter((c) => c.name !== name));
  };

  const setActiveCrop = (name) => {
    setSavedCrops((prev) => {
      const index = prev.findIndex((c) => c.name === name);
      if (index <= 0) return prev;
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
