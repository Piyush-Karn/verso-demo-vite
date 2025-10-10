import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, MapPin } from 'lucide-react'

const mockDestinations = [
  {
    id: '1',
    name: 'Tropical Bali',
    description: 'Perfect beaches and cultural temples',
    theme: 'Beach',
    season: 'Best in April-September',
    distance: '12 hours from home'
  },
  {
    id: '2', 
    name: 'Mountain Japan',
    description: 'Cherry blossoms and ancient traditions',
    theme: 'Cultural',
    season: 'Best in March-May',
    distance: '14 hours from home'
  },
  {
    id: '3',
    name: 'Coastal Goa',
    description: 'Vibrant beaches and Portuguese heritage', 
    theme: 'Beach',
    season: 'Best in November-March',
    distance: '8 hours from home'
  }
]

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDestinations = mockDestinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDestinationPress = (destination: any) => {
    const countryName = destination.name.split(' ')[1] // Extract country name
    navigate(`/organize/${encodeURIComponent(countryName)}`)
  }

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">Explore</h1>
        <p className="text-gray-400 mb-4">Discover your next adventure</p>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Where do you want to go?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {['Distance', 'Time/Season', 'Theme', "I'm feeling lucky"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full whitespace-nowrap text-sm"
            >
              <Filter size={14} />
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mx-4 mb-4">
        <div className="h-40 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 text-gray-400" size={32} />
            <span className="text-gray-400">Interactive Map</span>
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="px-4 pb-20">
        <h2 className="text-lg font-semibold mb-4">Recommended Destinations</h2>
        <div className="space-y-4">
          {filteredDestinations.map((destination) => (
            <button
              key={destination.id}
              className="w-full bg-gray-800 rounded-2xl p-4 hover:bg-gray-700 transition-colors"
              onClick={() => handleDestinationPress(destination)}
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  {destination.name.split(' ')[1]?.slice(0, 2).toUpperCase() || destination.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-white text-lg font-semibold">{destination.name}</h3>
                  <p className="text-gray-300 text-sm mb-2">{destination.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-gray-700 px-2 py-1 rounded text-gray-300">{destination.season}</span>
                    <span className="bg-gray-700 px-2 py-1 rounded text-gray-300">{destination.distance}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}