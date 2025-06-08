"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import citiesData from "../../data/cities.json";

interface City {
  id: string;
  name: string;
  displayName: string;
}

interface CityContextType {
  selectedCity: City;
  selectedCityId: string;
  cities: City[];
  setSelectedCity: (cityId: string) => void;
  showCityModal: boolean;
  setShowCityModal: (show: boolean) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [selectedCityId, setSelectedCityId] = useState<string>(
    citiesData.defaultCity
  );
  const [showCityModal, setShowCityModal] = useState(false);

  // Get the selected city object
  const selectedCity =
    citiesData.cities.find((city) => city.id === selectedCityId) ||
    citiesData.cities[0];

  // Load saved city from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity && citiesData.cities.find((city) => city.id === savedCity)) {
      setSelectedCityId(savedCity);
    }
  }, []);

  // Save city to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("selectedCity", selectedCityId);
  }, [selectedCityId]);

  const setSelectedCity = (cityId: string) => {
    if (citiesData.cities.find((city) => city.id === cityId)) {
      setSelectedCityId(cityId);
      setShowCityModal(false);
    }
  };

  const value: CityContextType = {
    selectedCity,
    selectedCityId,
    cities: citiesData.cities,
    setSelectedCity,
    showCityModal,
    setShowCityModal,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
