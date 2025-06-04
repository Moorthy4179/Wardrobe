import React, { useState } from "react";

const CalendarPage = () => {
  const [outfits, setOutfits] = useState({
    1: "outfit1.jpg",
    2: "outfit2.jpg",
    5: "outfit3.jpg",
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &lt;
        </button>
        <h1 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long" })}{" "}
          {currentDate.getFullYear()}
        </h1>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          &gt;
        </button>
      </header>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-gray-700 font-semibold p-1 bg-gray-50 rounded"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for offset */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="bg-gray-100 h-24 rounded"
          ></div>
        ))}

        {/* Days in Month */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            className="flex flex-col items-center justify-center bg-white border rounded shadow p-1 h-24"
          >
            <span className="text-gray-700 font-semibold">{day}</span>
            {outfits[day] ? (
              <img
                src={outfits[day]}
                alt={`Outfit for day ${day}`}
                className="w-16 h-16 object-cover mt-1 rounded"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center mt-1 border rounded text-sm text-gray-500">
                No Outfit
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-4 p-4 text-center text-gray-600">
        <p>Stay organized and stylish!</p>
      </footer>
    </div>
  );
};

export default CalendarPage;
