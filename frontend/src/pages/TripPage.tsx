import React from 'react'
import { useNavigate } from 'react-router-dom'

const mockCountries = [
  { country: 'Japan', count: 12 },
  { country: 'Bali', count: 8 },
  { country: 'Goa', count: 5 }
]

export const TripPage: React.FC = () => {
  const navigate = useNavigate()

  const handleCountrySelect = (country: string) => {
    navigate(`/trip/questionnaire?country=${encodeURIComponent(country)}`)
  }

  return (
    <div className="flex-1 bg-black text-white min-h-screen p-4">
      <div className="pt-4">
        <h1 className="text-2xl font-bold mb-2">Ready to plan?</h1>
        <p className="text-gray-400 mb-8">
          Choose a collection below to build your trip from your saved inspirations
        </p>
      </div>

      <div className="grid gap-4">
        {mockCountries.map((c) => (
          <button
            key={c.country}
            onClick={() => handleCountrySelect(c.country)}
            className="relative bg-gray-900 rounded-2xl p-6 hover:bg-gray-800 transition-colors"
          >
            <div className="absolute top-4 right-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                {c.country.slice(0, 2).toUpperCase()}
              </div>
            </div>
            <h2 className="text-xl font-semibold text-left mb-2">{c.country}</h2>
            <p className="text-gray-400 text-left mb-4">{c.count} inspirations</p>
            <div className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full w-fit">
              <span>✈️</span>
              <span className="font-medium">Plan Trip</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}