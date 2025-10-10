import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, MapPin, Plane, Car, Calendar } from 'lucide-react'

export const ItineraryPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const country = searchParams.get('country') || 'Destination'
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const travelers = searchParams.get('travelers') || '2'
  const homeLocation = searchParams.get('homeLocation') || 'Your City'
  const duration = searchParams.get('duration') || '7'

  // Mock itinerary data
  const mockItinerary = [
    {
      day: 1,
      city: country,
      activities: ['Arrive at airport', 'Check into hotel', 'Explore local area'],
      transport: 'flight'
    },
    {
      day: 2,
      city: country,
      activities: ['Cultural tour', 'Local cuisine tasting', 'Evening leisure'],
      transport: 'car'
    },
    {
      day: 3,
      city: `${country} - Day Trip`,
      activities: ['Adventure activity', 'Scenic views', 'Traditional experience'],
      transport: 'car'
    }
  ]

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-700">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">Your {country} Itinerary</h1>
          <p className="text-sm text-gray-400">{duration} days • {travelers} travelers</p>
        </div>
      </div>

      {/* Trip Summary */}
      <div className="p-4 bg-gray-800 m-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={16} className="text-yellow-400" />
          <span className="font-medium">Trip Overview</span>
        </div>
        <div className="text-sm text-gray-300 space-y-1">
          <p>From: {homeLocation}</p>
          <p>To: {country}</p>
          <p>Dates: {startDate} - {endDate}</p>
          <p>Duration: {duration} days</p>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-yellow-400" />
          Your Journey
        </h2>
        
        <div className="space-y-4">
          {mockItinerary.map((day, index) => (
            <div key={day.day} className="flex items-start gap-4">
              {/* Transport Icon */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900">
                  {day.transport === 'flight' ? (
                    <Plane size={20} />
                  ) : (
                    <Car size={20} />
                  )}
                </div>
                {index < mockItinerary.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-600 mt-2" />
                )}
              </div>

              {/* Day Content */}
              <div className="flex-1 bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">Day {day.day}</h3>
                  <span className="text-sm text-gray-400">{day.city}</span>
                </div>
                <ul className="text-sm text-gray-300 space-y-1">
                  {day.activities.map((activity, actIndex) => (
                    <li key={actIndex}>• {activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3 pb-20">
        <button 
          onClick={() => navigate(`/trip/hotels?country=${country}`)}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          🏨 Find Hotels
        </button>
        
        <button 
          onClick={() => navigate(`/trip/cafes?country=${country}`)}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          ☕ Discover Cafes & Food
        </button>
        
        <button 
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 rounded-full transition-colors"
        >
          Confirm Itinerary
        </button>
      </div>
    </div>
  )
}