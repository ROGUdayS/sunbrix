"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface City {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface CityContextType {
  selectedCity: City | null;
  selectedCityId: string;
  cities: City[];
  loading: boolean;
  error: string | null;
  setSelectedCity: (cityId: string) => void;
  showCityModal: boolean;
  setShowCityModal: (show: boolean) => void;
  refreshCities: () => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [showCityModal, setShowCityModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the selected city object
  const selectedCity =
    cities.find((city) => city.id === selectedCityId) || cities[0] || null;

  const fetchCities = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/cities?active=true");
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      const citiesData = await response.json();
      setCities(citiesData);

      // Set default city if none selected
      if (!selectedCityId && citiesData.length > 0) {
        setSelectedCityId(citiesData[0].id);
      }
    } catch (err) {
      console.error("Error fetching cities:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  const refreshCities = () => {
    fetchCities();
  };

  // Load cities on mount
  useEffect(() => {
    fetchCities();
  }, []);

  // Load saved city from localStorage on mount
  useEffect(() => {
    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity && cities.find((city) => city.id === savedCity)) {
      setSelectedCityId(savedCity);
    }
  }, [cities]);

  // Save city to localStorage when it changes
  useEffect(() => {
    if (selectedCityId) {
      localStorage.setItem("selectedCity", selectedCityId);
    }
  }, [selectedCityId]);

  const setSelectedCity = (cityId: string) => {
    if (cities.find((city) => city.id === cityId)) {
      setSelectedCityId(cityId);
      setShowCityModal(false);
    }
  };

  const value: CityContextType = {
    selectedCity,
    selectedCityId,
    cities,
    loading,
    error,
    setSelectedCity,
    showCityModal,
    setShowCityModal,
    refreshCities,
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
