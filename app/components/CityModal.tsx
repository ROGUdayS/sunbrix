"use client";

import { useCity } from "../contexts/CityContext";

export default function CityModal() {
  const {
    cities,
    selectedCityId,
    setSelectedCity,
    showCityModal,
    setShowCityModal,
  } = useCity();

  if (!showCityModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Select City</h2>
          <button
            onClick={() => setShowCityModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => setSelectedCity(city.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedCityId === city.id
                  ? "bg-amber-100 text-amber-900 border-2 border-amber-300"
                  : "bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{city.name}</span>
                {selectedCityId === city.id && (
                  <svg
                    className="w-5 h-5 text-amber-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
