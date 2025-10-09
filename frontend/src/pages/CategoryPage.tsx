import React from 'react'
import { useParams } from 'react-router-dom'

export const CategoryPage: React.FC = () => {
  const { country, categoryName } = useParams()
  
  return (
    <div className="flex-1 bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-4">{categoryName} in {country}</h1>
      <p className="text-gray-400">Category page - Coming soon</p>
    </div>
  )
}