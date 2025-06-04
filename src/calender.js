import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

const CalendarComponent = () => {
  const [calendarData, setCalendarData] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentYear, setCurrentYear] = useState(2025); 
  const [currentMonth, setCurrentMonth] = useState(2); 

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alumnibackend.42web.io/vwobackend';

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true); 
        const response = await fetch(`${API_BASE_URL}/fetch_calendar.php`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (data.success) {
          const dataByDate = {};

          data.calendar.forEach((item) => {
            let itemImages = [];

            if (typeof item.items === "object") {
              Object.keys(item.items).forEach((category) => {
                const categoryItems = Array.isArray(item.items[category])
                  ? item.items[category]
                  : [item.items[category]];
                categoryItems.forEach((product) => {
                  // Updated image URL to use InfinityFree backend
                  const imageUrl = `https://alumnibackend.42web.io/uploads/${product.image_url}`;
                  console.log("Image URL:", imageUrl);
                  itemImages.push(imageUrl);
                });
              });

              dataByDate[item.date] = itemImages;
            }
          });

          setCalendarData(dataByDate);
        } else {
          setError(data.message || "No data found.");
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false); 
      }
    };

    fetchCalendarData();
  }, [API_BASE_URL]);

  // Function to handle favorites (you can extend this to save to backend)
  const handleFavoriteClick = async (imgUrl) => {
    try {
      // Update local state immediately for better UX
      setFavorites((prevFavorites) => {
        const isFavorited = prevFavorites[imgUrl];
        const updatedFavorites = { ...prevFavorites };
        if (isFavorited) {
          delete updatedFavorites[imgUrl];
        } else {
          updatedFavorites[imgUrl] = true;
        }
        return updatedFavorites;
      });

      // Optional: Save to backend
      const response = await fetch(`${API_BASE_URL}/favorites.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: imgUrl,
          action: favorites[imgUrl] ? 'remove' : 'add'
        })
      });

      if (!response.ok) {
        console.warn('Failed to sync favorite with backend');
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
      // Revert local state if backend call fails
      setFavorites((prevFavorites) => {
        const updatedFavorites = { ...prevFavorites };
        if (favorites[imgUrl]) {
          updatedFavorites[imgUrl] = true;
        } else {
          delete updatedFavorites[imgUrl];
        }
        return updatedFavorites;
      });
    }
  };

  // Load favorites from backend on component mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/favorites.php`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.favorites) {
            const favoritesObj = {};
            data.favorites.forEach(fav => {
              favoritesObj[fav.image_url] = true;
            });
            setFavorites(favoritesObj);
          }
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [API_BASE_URL]);

  const openPopup = (date) => {
    setSelectedDate(date);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
  };

  const generateCalendar = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
    const calendarDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null); 
    }

    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    const totalCells = calendarDays.length + firstDayOfMonth;
    while (calendarDays.length < totalCells) {
      calendarDays.push(null); 
    }

    return calendarDays;
  };

  const renderCalendar = () => {
    const days = generateCalendar(currentYear, currentMonth);

    return (
      <>
        <div className="calendar-weekdays">
          {weekdays.map((weekday, index) => (
            <div key={index} className="calendar-weekday">
              {weekday}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day, index) => (
            <div
              key={index}
              className="calendar-cell"
              onClick={() => day && openPopup(`${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`)}
            >
              {day && (
                <>
                  <div className="date-number">{day}</div>
                  <div className="image-container">
                    {(calendarData[`${currentYear}-${currentMonth.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`] || []).map((imgUrl, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={imgUrl}
                        alt={`Image for ${day}`}
                        className="calendar-image"
                        onError={(e) => {
                          console.warn(`Failed to load image: ${imgUrl}`);
                          e.target.style.display = "none";
                        }}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  if (loading) {
    return (
      <div className="calendar-container">
        <Navbar />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading calendar data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-container">
        <Navbar />
        <div className="error">
          <p>⚠️ {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <Navbar />
      <div className="calendar-header">
        <button onClick={handlePrevMonth} aria-label="Previous month">{"<"}</button>
        <span>{`${monthNames[currentMonth - 1]} ${currentYear}`}</span>
        <button onClick={handleNextMonth} aria-label="Next month">{">"}</button>
      </div>
      {renderCalendar()}

      {showPopup && selectedDate && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Outfits of {`${monthNames[currentMonth - 1]} ${selectedDate.split('-')[2]}`}</h2>
            </div>
            {calendarData[selectedDate] && calendarData[selectedDate].length > 0 ? (
              <div className="popup-images">
                {calendarData[selectedDate].map((img, index) => (
                  <div key={index} className="popup-image-container">
                    <img 
                      src={img} 
                      alt={`Item ${index + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        console.warn(`Failed to load popup image: ${img}`);
                        e.target.src = '/placeholder-image.png'; // Add a placeholder image
                      }}
                    />
                    <button
                      className="favorite-button"
                      onClick={() => handleFavoriteClick(img)}
                      aria-label={favorites[img] ? "Remove from favorites" : "Add to favorites"}
                    >
                      {favorites[img] ? "❤️" : "🤍"}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No items for this date.</p>
            )}
            <div className="popup-footer">
              <button className="close-button" onClick={closePopup}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .calendar-container {
          width: 85%;
          margin: auto;
          text-align: center;
          font-family: Arial, sans-serif;
        }

        .calendar-header {
          background-color: #76c7f0;
          color: white;
          font-size: 1.5em;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .calendar-header button {
          background-color: transparent;
          border: none;
          font-size: 1.5em;
          color: white;
          cursor: pointer;
          padding: 0 15px;
          transition: opacity 0.2s;
        }

        .calendar-header button:hover {
          opacity: 0.7;
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          margin-bottom: 5px;
        }

        .calendar-weekday {
          font-weight: bold;
          color: #333;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
        }

        .calendar-cell {
          border: 1px solid #ddd;
          padding: 10px;
          min-height: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: start;
          background: white;
          border-radius: 5px;
          cursor: pointer;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s;
        }

        .calendar-cell:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .date-number {
          font-weight: bold;
          margin-bottom: 5px;
          color: #333;
        }

        .image-container {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          max-width: 100%;
          gap: 5px;
        }

        .calendar-image {
          max-width: 40px;
          max-height: 40px;
          border-radius: 5px;
          object-fit: cover;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #666;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #76c7f0;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #d32f2f;
        }

        .error button {
          margin-top: 10px;
          padding: 8px 16px;
          background-color: #76c7f0;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .popup-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          width: 80%;
          max-width: 500px;
          position: relative;
          text-align: center;
          max-height: 80vh;
          overflow-y: auto;
        }

        .popup-header {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 15px;
        }

        .popup-header h2 {
          margin: 0;
          color: #333;
        }

        .popup-images {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          gap: 10px;
          padding: 10px;
        }

        .popup-image-container {
          position: relative;
          min-width: 100px;
        }

        .popup-images img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 5px;
        }

        .favorite-button {
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          position: absolute;
          top: 5px;
          right: 5px;
          background-color: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .popup-footer {
          margin-top: 20px;
          text-align: right;
        }

        .close-button {
          font-size: 1.2em;
          padding: 8px 16px;
          background-color: rgb(240, 130, 130);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .close-button:hover {
          background-color: rgb(220, 110, 110);
        }

        @media (max-width: 768px) {
          .calendar-container {
            width: 95%;
          }
          
          .calendar-header {
            font-size: 1.2em;
          }
          
          .calendar-cell {
            min-height: 80px;
            padding: 5px;
          }
          
          .popup-content {
            width: 95%;
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;