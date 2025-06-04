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

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setLoading(true); 
        const response = await fetch(
          "http://localhost/vwobackend/fetch_calendar.php"
        );
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
                  const imageUrl = `http://localhost/vwobackend/uploads/${product.image_url}`;
                  console.log("Image URL:", imageUrl);
                  itemImages.push(imageUrl);
                });
              });

              dataByDate[item.date] = itemImages;
            }
          });

          setCalendarData(dataByDate);
        } else {
          setError("No data found.");
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setError("Error fetching data.");
      } finally {
        setLoading(false); 
      }
    };

    fetchCalendarData();
  }, []);

  const openPopup = (date) => {
    setSelectedDate(date);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedDate(null);
  };

  const handleFavoriteClick = (imgUrl) => {
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
                        onError={(e) => (e.target.style.display = "none")} 
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

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="calendar-container">
      <Navbar />
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>{"<"}</button>
        {`${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][currentMonth - 1]} ${currentYear}`}
        <button onClick={handleNextMonth}>{">"}</button>
      </div>
      {renderCalendar()}

      {showPopup && selectedDate && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Outfits of {`${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][currentMonth - 1]} ${selectedDate.split('-')[2]}`}</h2>
            </div>
            {calendarData[selectedDate] && calendarData[selectedDate].length > 0 ? (
              <div className="popup-images">
                {calendarData[selectedDate].map((img, index) => (
                  <div key={index} className="popup-image-container">
                    <img src={img} alt={`Item ${index + 1}`} />
                    <button
                      className="favorite-button"
                      onClick={() => handleFavoriteClick(img)}
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
          justify-content: center;
          align-items: center;
        }

        .calendar-header button {
          background-color: transparent;
          border: none;
          font-size: 1.5em;
          color: white;
          cursor: pointer;
          padding: 0 10px;
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 10px;
          margin-bottom: 5px;
        }

        .calendar-weekday {
          font-weight: bold;
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
          transition: transform 0.2s ease-in-out;
        }

        .calendar-cell:hover {
          transform: scale(1.05);
        }

        .date-number {
          font-weight: bold;
          margin-bottom: 5px;
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
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
        }

        .popup-images {
          display: flex;
          flex-direction: row;
          overflow-x: auto;
          gap: 10px;
          padding: 10px;
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
          left: 10px;
          bottom: 10px;
        }

        .popup-footer {
          margin-top: 20px;
          text-align: right;
        }

        .close-button {
          font-size: 1.2em;
          padding: 5px 10px;
          background-color:rgb(240, 130, 130);
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default CalendarComponent;
