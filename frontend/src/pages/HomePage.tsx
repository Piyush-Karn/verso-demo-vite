import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCountries, type CountrySummary } from '../api/client'
import { getCachedImage } from '../services/imageCache'
import { seedIfNeeded } from '../demo/seed'

const staticThumb: Record<string, string> = {
  Japan: '/images/japan-thumb.jpg',
  Bali: '/images/bali-thumb.jpg', 
  Goa: '/images/goa-thumb.jpg'
}

const queryForCountry = (c: string) => {
  if (c === 'Bali') return 'Bali turquoise beach aerial'
  if (c === 'Japan') return 'Japan mountain lake sunrise'
  if (c === 'Goa') return 'Goa beach sunset palm trees'
  return `${c} travel landscape`
}

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [countries, setCountries] = useState<CountrySummary[]>([])
  const [thumbs, setThumbs] = useState<Record<string, string>>({})
  const [picked, setPicked] = useState<string | null>(null)
  const tries = useRef(0)
  const polling = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    seedIfNeeded()
    const run = async () => {
      try {
        setLoading(true)
        const data = await fetchCountries()
        setCountries(data)
        if (data.length === 0 && tries.current < 10) {
          tries.current += 1
          polling.current = setTimeout(run, 2000)
        } else {
          const results = await Promise.all(
            data.map(async (c) => ({ key: c.country, val: await getCachedImage(queryForCountry(c.country)) }))
          )
          const next: Record<string, string> = {}
          results.forEach((r) => { if (r.val) next[r.key] = r.val })
          setThumbs(next)
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => { if (polling.current) clearTimeout(polling.current) }
  }, [])

  const countryNames = useMemo(() => countries.map((c) => c.country), [countries])

  const onPick = (c: string) => setPicked(c)
  const onNavigate = () => { if (picked) navigate(`/organize/${encodeURIComponent(picked)}?focus=1`) }
  const onCardPress = (c: string) => onPick(c)

  return (
    <div className="flex-1 bg-gray-900 text-white">
      <div className="pt-6 px-4 pb-2">
        <h1 className="text-white text-xl font-semibold">Hello, Explorer</h1>
        <p className="text-gray-400 mt-1">
          {countries.reduce((a, c) => a + c.count, 0)} Collections saved across {countries.length} Countries
        </p>
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => navigate('/organize/interests')} 
            className="border border-gray-600 rounded-full px-3 py-1.5 text-xs text-gray-300"
          >
            Your Interests
          </button>
          {picked && (
            <button 
              onClick={() => setPicked(null)} 
              className="border border-gray-600 rounded-full px-3 py-1.5 text-xs text-gray-300"
            >
              Back to all
            </button>
          )}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="flex justify-center py-2">
        <div className="w-80 h-40 bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Interactive Map</span>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto"></div>
            <p className="text-gray-400 text-xs mt-3 text-center">
              If this is your first load, we are priming demo content. This can take ~20–40s.
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="flex-1 px-4">
          <h2 className="text-gray-300 text-base mb-2">Your Collections</h2>
          <div className="space-y-3 pb-20">
            {countries.map((c) => {
              const base64 = thumbs[c.country] || staticThumb[c.country]
              const dim = picked && c.country !== picked
              return (
                <button
                  key={c.country}
                  onClick={() => onCardPress(c.country)}
                  className={`w-full flex items-center bg-gray-800 rounded-2xl p-3 gap-3 transition-opacity ${
                    dim ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  {base64 ? (
                    <img 
                      src={base64.startsWith('data:') ? base64 : `data:image/jpeg;base64,${base64}`}
                      alt={c.country}
                      className="w-21 h-21 rounded-xl object-cover bg-gray-700"
                    />
                  ) : (
                    <div className="w-21 h-21 rounded-xl bg-gray-700 animate-pulse" />
                  )}
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
            className="w-full bg-secondary hover:bg-secondary/90 text-gray-900 font-bold py-4 rounded-full"
          >
            Take me to {picked}
          </button>
        </div>
      ) : (
        <button 
          onClick={() => navigate('/add')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-gray-900 text-2xl font-semibold shadow-lg"
        >
          +
        </button>
      )}
    </div>
  )
}