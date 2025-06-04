import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { FaTrash } from "react-icons/fa";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alumnibackend.42web.io/vwobackend';
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fetch_favorites.php`);
        const data = await response.json();

        if (data.success && Array.isArray(data.favorites)) {
          setFavorites(data.favorites);
        } else {
          setError("No favorites found.");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleDelete = (index) => {
    const updatedFavorites = [...favorites];
    updatedFavorites.splice(index, 1);
    setFavorites(updatedFavorites);
  };

  return (
    <div className="favorites-container">
      <Navbar />
      <div className="content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : favorites.length === 0 ? (
          <div className="no-favorites">You have no favorite outfits yet.</div>
        ) : (
          <div className="favorites-grid">
            {favorites.map((favorite, index) => (
              <div className="favorite-card" key={index}>
                <div className="card-header">
                  <h3 className="card-title">Outfit {index + 1}</h3>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>
                    <FaTrash />
                  </button>
                </div>
                <div className="item-grid">
                  {Object.keys(favorite.items).map((category) => {
                    const categoryItems = favorite.items[category];
                    return Array.isArray(categoryItems)
                      ? categoryItems.map((item) => (
                          <img
                            key={item.id}
                            src={`${API_BASE_URL}/uploads/${item.image_url}`}
                            alt="Favorite Item"
                            className="favorite-image"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ))
                      : (
                          <img
                            key={categoryItems.id}
                            src={`${API_BASE_URL}/uploads/${categoryItems.image_url}`}
                            alt="Favorite Item"
                            className="favorite-image"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .favorites-container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          background: url('https://img.freepik.com/free-photo/heart-shape-handmade-toys-turquoise-wood_23-2147993009.jpg') no-repeat center center/cover;
          padding: 80px 20px 20px; /* Prevent hiding behind navbar */
          box-sizing: border-box;
        }

        .content {
          width: 90%;
          max-width: 1000px;
          background: rgba(255, 255, 255, 0.95);
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .favorites-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
          margin-top: 15px;
        }

        .favorite-card {
          background: white;
          border-radius: 10px;
          padding: 15px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s;
          width: 240px;
          height: 300px;
        }

        .favorite-card:hover {
          transform: scale(1.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          font-size: 1em;
          font-weight: bold;
        }

        .delete-btn {
          background: red;
          color: white;
          border: none;
          padding: 6px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: 0.2s;
        }

        .delete-btn:hover {
          background: darkred;
        }

        .item-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 10px;
        }

        .favorite-image {
          width: 100%;
          aspect-ratio: 1/1;
          object-fit: cover;
          border-radius: 6px;
        }

        .loading, .error, .no-favorites {
          text-align: center;
          font-size: 1.1em;
          color: #555;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default FavoritesPage;
