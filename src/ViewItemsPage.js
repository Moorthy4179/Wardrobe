import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa"; 

function WardrobeViewPage() {
    const [items, setItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(""); 
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); 
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
    const filteredItems = items.filter((item) => item.type === selectedCategory);

    const handleDeleteItem = async (itemId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/deletewardrobeitem.php`, {
    method: "POST",
    body: JSON.stringify({ id: itemId }),
    headers: {
        "Content-Type": "application/json",
    },
});
            const data = await response.json();
            if (data.success) {
                setItems(items.filter(item => item.id !== itemId));
                setShowDeleteModal(false); 
            } else {
                setError(data.message || "Failed to delete item");
            }
        } catch (error) {
            setError("An error occurred while deleting the item");
            console.error("Error deleting item:", error);
        }
    };

    return (
        <div 
    className="container-fluid d-flex flex-column min-vh-100"
    style={{
        backgroundImage: "url('https://img.freepik.com/free-photo/green-bokeh-wall-with-beige-marble-floor-product-background_53876-102468.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        width: "100vw"
    }}
>
            <Navbar />
            <div className="container mt-4">
                <h2 className="mb-4 text-white">Your Wardrobe Items</h2>
                {error && <div style={{ color: "red" }}><strong>{error}</strong></div>}
                <div className="text-end mb-3">
                    <Link to="/wardrobe" className="btn btn-primary">
                        Add Item
                    </Link>
                </div>
                <div className="mb-4">
                    <ul className="nav nav-pills">
                        {categories.map((category) => (
                            <li className="nav-item" key={category}>
                                <button
                                    className={`nav-link ${selectedCategory === category ? "active" : ""}`}
                                    onClick={() => setSelectedCategory(category)}>{category}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="row">
                    {selectedCategory === "" ? ( 
                        <p className="text-white">Please select a category to view items.</p>
                    ) : filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div key={item.id} className="col-md-4 mb-4">
                                <div className="card">
                                    <img
                                        src={`${API_BASE_URL}/uploads/${item.image_url}`}
                                        alt={item.name}
                                        className="card-img-top"
                                        style={{ width: "100%", height: "auto", maxHeight: "250px", objectFit: "contain" }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{item.name}</h5>
                                        <p className="card-text">Type: {item.type}</p>
                                    </div>
                                    <button
                                        className="btn btn-danger position-absolute bottom-0 end-0 m-2"
                                        onClick={() => {
                                            setItemToDelete(item); 
                                            setShowDeleteModal(true); 
                                        }}
                                        style={{ borderRadius: "50%" }}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white">No items found in this category.</p>
                    )}
                </div>
            </div>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete "{itemToDelete?.name}" from your wardrobe?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteItem(itemToDelete?.id)}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default WardrobeViewPage;
