import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { TripPage } from './pages/TripPage'
import { CountryPage } from './pages/CountryPage'
import { CategoryPage } from './pages/CategoryPage'
import { CityPage } from './pages/CityPage'
import { QuestionnairePage } from './pages/QuestionnairePage'
import { ItineraryPage } from './pages/ItineraryPage'
import { HotelsPage } from './pages/HotelsPage'
import { CafesPage } from './pages/CafesPage'
import { InterestsPage } from './pages/InterestsPage'
import { AddPage } from './pages/AddPage'
import { AuthPage } from './pages/AuthPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="trip" element={<TripPage />} />
          
          {/* Organize routes */}
          <Route path="organize/:country" element={<CountryPage />} />
          <Route path="organize/:country/category/:categoryName" element={<CategoryPage />} />
          <Route path="organize/:country/:city" element={<CityPage />} />
          <Route path="organize/interests" element={<InterestsPage />} />
          
          {/* Trip planning routes */}
          <Route path="trip/questionnaire" element={<QuestionnairePage />} />
          <Route path="trip/itinerary" element={<ItineraryPage />} />
          <Route path="trip/hotels" element={<HotelsPage />} />
          <Route path="trip/cafes" element={<CafesPage />} />
          
          {/* Other routes */}
          <Route path="add" element={<AddPage />} />
          <Route path="auth" element={<AuthPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App