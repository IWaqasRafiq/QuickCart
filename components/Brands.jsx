import React, { useState, useRef } from 'react'
import SearchBar from './SearchBar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons'

const brandList = [
  "Alkaram",
  "Khaadi",
  "Agha Noor",
  "Ideas",
  "Sana Safinaz",
  "Bonanza",
  "Asim Jofa",
  "Breeze",
  "Tawakkal",
  "Sania Maskatiya",
]

const Brands = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const scrollRef = useRef(null)

  // Scroll buttons handler
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="flex justify-between items-center px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      
      {/* Left Section */}
      <div className="flex items-center gap-4 lg:gap-8">
        
        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-4">
          <h2 className="text-lg font-semibold">Brands</h2>

          {/* Wrapper with scroll */}
          <div className="flex items-center gap-2 max-w-md">
            {/* Scroll Left Button */}
            <button onClick={() => scroll('left')} className="text-gray-600">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>

            {/* Brands Scrollable Container */}
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scroll-smooth whitespace-nowrap no-scrollbar"
            >
              {brandList.map((brand, index) => (
                <a
                  key={index}
                  href={`/${brand.replace(/\s+/g, '-')}`}
                  className="whitespace-nowrap hover:text-black"
                >
                  {brand}
                </a>
              ))}
            </div>

            {/* Scroll Right Button */}
            <button onClick={() => scroll('right')} className="text-gray-600">
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOpen(true)} className="text-xl">
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar />

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div className="bg-white w-64 h-full p-6 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Brands</h2>
              <button onClick={() => setMenuOpen(false)} className="text-xl">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {brandList.map((brand, index) => (
                <a 
                  key={index} 
                  href={`/listings/filter/${brand.replace(/\s+/g, '-')}`} 
                  className="hover:text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  {brand}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Brands
