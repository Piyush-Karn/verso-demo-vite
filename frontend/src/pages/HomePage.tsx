import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock data for demo
const mockCountries = [
  { country: 'Japan', count: 12 },
  { country: 'Bali', count: 8 },
  { country: 'Goa', count: 5 }
]

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [countries] = useState(mockCountries)
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const onPick = (c: string) => setPicked(c)
  const onNavigate = () => { 
    if (picked) navigate(`/organize/${encodeURIComponent(picked)}?focus=1`) 
  }
  const onCardPress = (c: string) => onPick(c)

  return (
    <div className="flex-1 bg-gray-900 text-white min-h-screen">
      <div className="pt-6 px-4 pb-2">
        <h1 className="text-white text-xl font-semibold">Hello, Explorer</h1>
        <p className="text-gray-400 mt-1">
          {countries.reduce((a, c) => a + c.count, 0)} Collections saved across {countries.length} Countries
        </p>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => navigate('/organize/interests')} 
            className="border border-gray-600 rounded-full px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
          >
            Your Interests
          </button>
          {picked && (
            <button 
              onClick={() => setPicked(null)} 
              className="border border-gray-600 rounded-full px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700"
            >
              Back to all
            </button>
          )}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="flex justify-center py-4">
        <div className="w-80 h-40 bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Interactive Map</span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
            <p className="text-gray-400 text-xs mt-3 text-center">
              Loading your travel collections...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 px-4">
          <h2 className="text-gray-300 text-base mb-4">Your Collections</h2>
          <div className="space-y-3 pb-20">
            {countries.map((c) => {
              const dim = picked && c.country !== picked
              return (
                <button
                  key={c.country}
                  onClick={() => onCardPress(c.country)}
                  className={`w-full flex items-center bg-gray-800 rounded-2xl p-4 gap-3 transition-all hover:bg-gray-700 ${
                    dim ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {c.country.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`text-lg font-semibold ${dim ? 'text-gray-600' : 'text-white'}`}>
                      {c.country}
                    </h3>
                    <p className={`mt-1 ${dim ? 'text-gray-700' : 'text-gray-400'}`}>
                      {c.count} Inspirations
                    </p>
                  </div>
                  <span className={`text-2xl ${dim ? 'text-gray-700' : 'text-gray-400'}`}>›</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {picked ? (
        <div className="fixed bottom-20 left-4 right-4">
          <button 
            onClick={onNavigate}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 rounded-full transition-colors"
          >
            Take me to {picked}
          </button>
        </div>
      ) : (
        <button 
          onClick={() => navigate('/add')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-yellow-400 hover:bg-yellow-300 rounded-full flex items-center justify-center text-gray-900 text-2xl font-semibold shadow-lg transition-colors"
        >
          +
        </button>
      )}
    </div>
  )
}