import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

const WardrobePage = () => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [image, setImage] = useState(null);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const navbarRef = useRef(null);

    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.offsetHeight);
        }
    }, []);

    const typeToNamesMap = {
        Top: ["T-Shirt", "Shirt", "Blouse", "Tank Top", "Hoodie", "Sweater", "Crop Top"],
        Bottom: ["Jeans", "Trousers", "Skirt", "Shorts", "Leggings", "Palazzo Pants", "Casual Pants"], 
        Dress: ["Maxi Dress", "Midi Dress", "Mini Dress", "Evening Gown", "Jumpsuit"],
        Outerwear: ["Jacket", "Blazer", "Coat", "Cardigan"],
        Shoes: ["Sneakers", "Sandals", "Boots", "Heels", "Flats"],
        Accessory: ["Scarf", "Hat", "Belt", "Sunglasses", "Watch"],
    };

    const handleAddItem = async (e) => {
        e.preventDefault();

        if (!name || !type || !image) {
            alert("Please fill in all fields and select an image!");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        formData.append("image", image);

        try {
            const response = await fetch("http://localhost/vwobackend/addWardrobeItem.php", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert("Item added successfully!");
                setName("");
                setType("");
                setImage(null);
            } else {
                alert("Error: " + data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding the item.");
        }
    };

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div style={{ paddingTop: `${navbarHeight}px` }}>
            <Navbar ref={navbarRef} />
            <div className="container mt-4">
                <h2 className="mb-4">Add a New Wardrobe Item</h2>

                <form onSubmit={handleAddItem} className="mb-4">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label>Type</label>
                            <select
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setName(""); 
                                }}
                                className="form-select"
                                required
                            >
                                <option value="">Select Type</option>
                                {Object.keys(typeToNamesMap).map((typeOption) => (
                                    <option key={typeOption} value={typeOption}>
                                        {typeOption}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label>Name</label>
                            <select
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="form-select"
                                required
                                disabled={!type}
                            >
                                <option value="">Select Name</option>
                                {type &&
                                    typeToNamesMap[type].map((nameOption) => (
                                        <option key={nameOption} value={nameOption}>
                                            {nameOption}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label>Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handleImageUpload}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        Add Item
                    </button>
                </form>
                <div className="mt-4">
                    <Link to="/view-items" className="btn btn-secondary">
                        View Wardrobe Items
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WardrobePage;
