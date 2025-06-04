import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaTimes } from "react-icons/fa"; 

function MakeOutfitPage() {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alumnibackend.42web.io/vwobackend';

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/viewwardrobeitem.php`);
                const data = await response.json();
                if (data.success) {
                    setItems(data.items);
                } else {
                    setError(data.message || "Failed to fetch items");
                }
            } catch (error) {
                setError("An error occurred while fetching the items");
                console.error("Error fetching items:", error);
            }
        };
        fetchItems();
    }, []);

    const categories = ["Top", "Bottom", "Outerwear", "Accessory", "Shoes"];

    const handleSelectItem = (category, item) => {
        setSelectedItems((prev) => {
            if (category === "Accessory") {
                return { ...prev, [category]: [...(prev[category] || []), item] };
            } else {
                return { ...prev, [category]: item };
            }
        });
    };
    const handleRemoveItem = (category, item) => {
        setSelectedItems((prev) => {
            if (category === "Accessory") {
                return { ...prev, [category]: prev[category].filter((i) => i.id !== item.id) };
            }
            const newSelectedItems = { ...prev };
            delete newSelectedItems[category];
            return newSelectedItems;
        });
    };

    const handleSaveOutfit = () => {
        setShowModal(true);
    };

    const handleSaveToFavorites = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/saveToFavorites.php`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ selectedItems: selectedItems }), 
});

            const data = await response.json();
            if (data.success) {
                alert("Outfit saved to favorites!");
            } else {
                alert("Failed to save to favorites!");
            }
        } catch (error) {
            console.error("Error saving outfit:", error);
            alert("An error occurred while saving.");
        }
    };

    const handleSaveToCalendar = () => {
        setShowDatePicker(true);
        setShowModal(false);
    };
    const confirmSaveToCalendar = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/saveToCalendar.php`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ selectedItems: selectedItems, date: selectedDate }),
});

            const data = await response.json();
            if (data.success) {
                alert(`Outfit saved for ${selectedDate.toDateString()}`);
            } else {
                alert("Failed to save to calendar!");
            }
        } catch (error) {
            console.error("Error saving outfit to calendar:", error);
            alert("An error occurred while saving.");
        }
        setShowDatePicker(false);
    };

    return (
        <div className="container mt-4">
            <Navbar />
            <h2 className="mb-4">Make Your Outfit</h2>
            {error && <div style={{ color: "red" }}><strong>{error}</strong></div>}
            {categories.map((category) => (
                <div key={category} className="mb-4">
                    <h4>{category}</h4>
                    <div className="row">
                        {items.filter(item => item.type === category).map((item) => (
                            <div key={item.id} className="col-md-3 mb-3">
                                <div 
                                    className={`card ${category === "Accessory" && selectedItems[category]?.some(i => i.id === item.id) ? "border-primary" : ""}`}
                                    onClick={() => handleSelectItem(category, item)}
                                    style={{ cursor: "pointer" }}>
                                    <img 
                                        src={`${API_BASE_URL}/uploads/${item.image_url}`}
                                        alt={item.name} 
                                        className="card-img-top"
                                        style={{ width: "100%", height: "200px", objectFit: "contain" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{item.name}</h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className="mt-4 text-center">
                <h3>Your Outfit:</h3>
                <div className="d-flex flex-wrap justify-content-center">
                    {Object.values(selectedItems).flat().map((item) => (
                        <div key={item.id} className="m-2 position-relative">
                            <img 
                                src={`${API_BASE_URL}/uploads/${item.image_url}`}
                                alt={item.name} 
                                style={{ width: "100px", height: "100px", objectFit: "contain" }}
                            />
                            <p className="text-center">{item.name}</p>
                            <button 
                                className="position-absolute top-0 right-0 btn btn-sm btn-danger" 
                                onClick={() => handleRemoveItem(item.type, item)}>
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
                <button className="btn btn-success mt-3" onClick={handleSaveOutfit}>Save Outfit</button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Save Outfit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Do you want to save your outfit to favorites or calendar?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSaveToFavorites}>Save to Favorites</Button>
                    <Button variant="secondary" onClick={handleSaveToCalendar}>Save to Calendar</Button>
                    <Button variant="danger" onClick={() => setShowModal(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showDatePicker} onHide={() => setShowDatePicker(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Date for Outfit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={confirmSaveToCalendar}>Confirm</Button>
                    <Button variant="danger" onClick={() => setShowDatePicker(false)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default MakeOutfitPage;
