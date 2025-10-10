import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Users, MapPin } from 'lucide-react'

export const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const preSelectedCountry = searchParams.get('country')

  const [formData, setFormData] = useState({
    destination: preSelectedCountry || '',
    startDate: '',
    endDate: '',
    travelers: '2',
    homeLocation: '',
    tripDuration: '7'
  })

  const countries = ['Japan', 'Bali', 'Goa', 'Thailand', 'Italy', 'France']
  const travelerOptions = ['1', '2', '3', '4', '5+']
  const durationOptions = ['3', '5', '7', '10', '14', '21']

  const handleSubmit = () => {
    if (formData.destination && formData.startDate && formData.endDate) {
      const params = new URLSearchParams({
        country: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        homeLocation: formData.homeLocation || 'Not specified',
        duration: formData.tripDuration
      })
      navigate(`/trip/itinerary?${params.toString()}`)
    }
  }

  return (
    <div className="flex-1 bg-black text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-800">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Plan Your Trip</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Destination */}
        {!preSelectedCountry && (
          <div>
            <label className="block text-sm font-medium mb-2">Where would you like to go?</label>
            <select
              value={formData.destination}
              onChange={(e) => setFormData({...formData, destination: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="">Select a destination</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        )}

        {/* Travel Dates */}
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar size={16} />
            When are you traveling? *
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Optional Details */}
        <div className="space-y-4 border-t border-gray-800 pt-6">
          <h3 className="text-lg font-medium text-gray-300">Optional Details</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">I want to travel for ___ days</label>
            <select
              value={formData.tripDuration}
              onChange={(e) => setFormData({...formData, tripDuration: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              {durationOptions.map(duration => (
                <option key={duration} value={duration}>{duration} days</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Users size={16} />
              Number of travelers
            </label>
            <select
              value={formData.travelers}
              onChange={(e) => setFormData({...formData, travelers: e.target.value})}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              {travelerOptions.map(option => (
                <option key={option} value={option}>{option} {option === '1' ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin size={16} />
              I am traveling from ___
            </label>
            <input
              type="text"
              value={formData.homeLocation}
              onChange={(e) => setFormData({...formData, homeLocation: e.target.value})}
              placeholder="Enter your home city"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <button 
          onClick={handleSubmit}
          disabled={!formData.destination || !formData.startDate || !formData.endDate}
          className="w-full bg-white hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold py-4 rounded-full transition-colors"
        >
          Continue to Itinerary
        </button>
      </div>
    </div>
  )
}