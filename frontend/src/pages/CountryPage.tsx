import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'

const mockCountryData: Record<string, any> = {
  Japan: {
    flag: '🇯🇵',
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    categories: ['Temples', 'Gardens', 'Sushi', 'Hot Springs'],
    seasons: [
      { month: 'March', highlight: 'Cherry Blossoms', activities: ['Temple visits', 'Hanami parties'] },
      { month: 'June', highlight: 'Rainy Season', activities: ['Indoor museums', 'Traditional crafts'] },
      { month: 'October', highlight: 'Autumn Colors', activities: ['Hiking', 'Photography'] }
    ]
  },
  Bali: {
    flag: '🇮🇩',
    cities: ['Ubud', 'Seminyak', 'Canggu'],
    categories: ['Beaches', 'Temples', 'Yoga', 'Surfing'],
    seasons: [
      { month: 'April', highlight: 'Dry Season', activities: ['Beach days', 'Temple tours'] },
      { month: 'July', highlight: 'Peak Season', activities: ['Surfing', 'Yoga retreats'] },
      { month: 'October', highlight: 'Perfect Weather', activities: ['Island hopping', 'Volcano hiking'] }
    ]
  },
  Goa: {
    flag: '🇮🇳',
    cities: ['Panaji', 'Anjuna', 'Arambol'],
    categories: ['Beaches', 'Nightlife', 'Seafood', 'Markets'],
    seasons: [
      { month: 'November', highlight: 'Cool Weather', activities: ['Beach relaxing', 'Market shopping'] },
      { month: 'December', highlight: 'Peak Tourism', activities: ['Nightlife', 'Water sports'] },
      { month: 'February', highlight: 'Carnival', activities: ['Festivals', 'Cultural events'] }
    ]
  }
}

export const CountryPage: React.FC = () => {
  const { country } = useParams<{ country: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'cities' | 'categories' | 'seasons'>('cities')

  const countryData = country ? mockCountryData[country] : null

  if (!country || !countryData) {
    return (
      <div className="flex-1 bg-gray-900 text-white p-4">
        <p className="text-red-400">Country not found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-700">
        <button onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{countryData.flag}</span>
          <h1 className="text-xl font-bold">{country}</h1>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {['cities', 'categories', 'seasons'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 px-4 capitalize ${
              activeTab === tab 
                ? 'border-b-2 border-yellow-400 text-yellow-400' 
                : 'text-gray-400'
            }`}
          >
            {tab === 'categories' ? 'Things to do' : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {activeTab === 'cities' && (
          <div className="grid grid-cols-2 gap-4">
            {countryData.cities.map((city: string) => (
              <button
                key={city}
                onClick={() => navigate(`/organize/${country}/${city}`)}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <MapPin className="mx-auto mb-2 text-yellow-400" size={24} />
                <h3 className="font-semibold">{city}</h3>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-2 gap-4">
            {countryData.categories.map((category: string) => (
              <button
                key={category}
                onClick={() => navigate(`/organize/${country}/category/${category}`)}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-2"></div>
                <h3 className="font-semibold">{category}</h3>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'seasons' && (
          <div className="space-y-4">
            {countryData.seasons.map((season: any) => (
              <div key={season.month} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} className="text-yellow-400" />
                  <h3 className="font-semibold">{season.month}</h3>
                </div>
                <p className="text-gray-300 mb-2">{season.highlight}</p>
                <div className="flex flex-wrap gap-2">
                  {season.activities.map((activity: string) => (
                    <span key={activity} className="bg-gray-700 px-2 py-1 rounded text-sm">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Your Trip CTA */}
      <div className="fixed bottom-20 left-4 right-4">
        <button 
          onClick={() => navigate(`/trip/questionnaire?country=${encodeURIComponent(country)}`)}
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 rounded-full transition-colors"
        >
          Plan Your Trip to {country}
        </button>
      </div>
    </div>
  )
}