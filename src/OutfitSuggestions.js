import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Navbar";

function OutfitSuggestionPage() {
    const [todaysOutfit, setTodaysOutfit] = useState({
        top: null,
        bottom: null,
        outerwear: null,
        shoes: null,
        accessories: [],
    });
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alumnibackend.42web.io/vwobackend';

    const [weather, setWeather] = useState(null);
    const [weatherIcon, setWeatherIcon] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeather();
    }, []);

    useEffect(() => {
        if (weather) {
            fetchOutfits();
        }
    }, [weather]);

    const fetchWeather = async () => {
        try {
            const apiKey = "59223b6d9710c67e8d7aa49ae03a520c";
            const city = "Chennai";
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
            );
            const data = await response.json();
    
            if (data.weather && data.weather.length > 0) {
                const weatherCondition = data.weather[0].main;
                setWeather(weatherCondition);
                const weatherIcons = {
                    Clear: "https://cdn-icons-png.flaticon.com/128/869/869869.png", // ☀️ Sunny
                    Clouds: "https://cdn-icons-png.flaticon.com/128/414/414927.png", // ☁️ Cloudy
                    Rain: "https://cdn-icons-png.flaticon.com/128/1163/1163657.png", // 🌧️ Rain
                    Thunderstorm: "https://cdn-icons-png.flaticon.com/128/1779/1779940.png", // ⛈️ Thunderstorm
                    Drizzle: "https://cdn-icons-png.flaticon.com/128/3076/3076171.png", // 🌦️ Drizzle
                    Snow: "https://cdn-icons-png.flaticon.com/128/2315/2315309.png", // ❄️ Snow
                    Mist: "https://cdn-icons-png.flaticon.com/128/4005/4005901.png", // 🌫️ Mist
                    Fog: "https://cdn-icons-png.flaticon.com/128/4005/4005901.png", // 🌁 Fog
                    Haze: "https://cdn-icons-png.flaticon.com/128/1779/1779809.png", // 🌫️ Haze
                    Wind: "https://cdn-icons-png.flaticon.com/128/1581/1581989.png", // 💨 Windy
                };
                setWeatherIcon(weatherIcons[weatherCondition] || "https://cdn-icons-png.flaticon.com/128/1163/1163657.png");
            } else {
                setError("Weather data is not available.");
            }
        } catch (error) {
            setError("Failed to fetch weather.");
        }
    };
    const fetchOutfits = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/getoutfits.php`);
        const data = await response.json();
        if (data.success) {
            recommendTodaysOutfit(data.outfits);
        } else {
            setError(data.message || "Failed to fetch outfits.");
        }
    } catch (error) {
        setError("Error fetching outfits.");
    }
};

    const recommendTodaysOutfit = (allOutfits) => {
        const getRandomItem = (items) => items.length ? items[Math.floor(Math.random() * items.length)] : null;

        let topOptions = allOutfits.filter(item => item.type === "Top");
        let bottomOptions = allOutfits.filter(item => item.type === "Bottom");
        let shoeOptions = allOutfits.filter(item => item.type === "Shoes");
        let outerwearOptions = [];
        let accessories = [];

        switch (weather) {
                case "Clear":
                    accessories = [
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Watch")),
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Sunglasses"))
                    ].filter(Boolean);
                    break;
        
                case "Sunny":
                    topOptions = allOutfits.filter(item => item.type === "Top" && item.name.includes("T-shirt"));
                    accessories = [
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Watch")),
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Sunglasses")),
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Hat"))
                    ].filter(Boolean);
                    break;
        
                    case "Clouds":
                        topOptions = allOutfits.filter(item => item.type === "Top" && item.name === "Sweater");
                        accessories = [
                            getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Watch"))
                        ].filter(Boolean);
                        break;
                    
        
                case "Rain":
                    outerwearOptions = allOutfits.filter(item => item.type === "Outerwear" && item.name === "Raincoat");
                    shoeOptions = allOutfits.filter(item => item.type === "Shoes" && item.name === "Boots");
                    accessories = [
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Umbrella")),
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Waterproof Bag"))
                    ].filter(Boolean);
                    break;
        
                case "Snow":
                    outerwearOptions = allOutfits.filter(item => item.type === "Outerwear" && (item.name === "Coat" || item.name === "Jacket"));
                    shoeOptions = allOutfits.filter(item => item.type === "Shoes" && item.name === "Boots");
                    accessories = [
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Scarf")),
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Gloves")),
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Beanie"))
                    ].filter(Boolean);
                    break;
        
                case "Wind":
                    outerwearOptions = allOutfits.filter(item => item.type === "Outerwear" && item.name === "Windbreaker");
                    accessories = [
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Hat"))
                    ].filter(Boolean);
                    break;
        
                case "Thunderstorm":
                    outerwearOptions = allOutfits.filter(item => item.type === "Outerwear" && item.name === "Raincoat");
                    shoeOptions = allOutfits.filter(item => item.type === "Shoes" && item.name === "Boots");
                    accessories = [
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Umbrella")),
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Waterproof Bag"))
                    ].filter(Boolean);
                    break;
        
                default:
                    accessories = [
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Watch")),
                        getRandomItem(allOutfits.filter(item => item.type === "Accessory" && item.name === "Hat"))
                    ].filter(Boolean);
                    break;
            }
        
            const selectedOutfit = {
                top: getRandomItem(topOptions),
                bottom: getRandomItem(bottomOptions),
                outerwear: getRandomItem(outerwearOptions),
                shoes: getRandomItem(shoeOptions),
                accessories: accessories
            };
        
            setTodaysOutfit(selectedOutfit);
    };

    const pageStyle = {
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif"
    };

    const sidebarStyle = {
        width: "60px",
        backgroundColor: "#333",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "20px",
        gap: "20px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0
    };

    const sidebarIconStyle = {
        fontSize: "24px",
        cursor: "pointer",
        color: "white",
        textDecoration: "none"
    };

    const contentWrapperStyle = {
        marginLeft: "60px",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#fefefe",
        overflowY: "auto"
    };

    const headerStyle = {
        textAlign: "center",
        marginBottom: "10px"
    };

    const outfitContainerStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px", 
        marginTop: "20px",
        width: "100%",
        maxWidth: "600px" 
    };
    
    const outfitItemStyle = {
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", 
        textAlign: "center",
        padding: "15px",
        width: "100%",
        minHeight: "180px", 
    };
    
    const outfitImageStyle = {
        width: "120px", 
        height: "120px", 
        objectFit: "cover",
        borderRadius: "8px"
    };
    

    const chooseButtonWrapperStyle = {
        marginTop: "auto",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "center",
        width: "100%"
    };
    
    const chooseButtonStyle = {
        background: "black",
        color: "white",
        border: "none",
        padding: "12px 24px",
        borderRadius: "24px",
        fontWeight: "bold",
        cursor: "pointer",
        textDecoration: "none",  
        textAlign: "center"
    };

    return (
        <div style={pageStyle}>
            <div style={sidebarStyle}>
            <Navbar  />
            </div>
            <div style={contentWrapperStyle}>
            <div style={{ width: "100%", textAlign: "center" }}>
                    <h4>Today's Outfit</h4>
                    <p>Weather: {weather || "Loading..."}</p>
                    {weatherIcon && <img src={weatherIcon} alt="Weather Icon" style={{ width: "50px", height: "50px" }} />}
                    {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
                </div>
                <div style={outfitContainerStyle}>
                    {["top", "bottom", "outerwear", "shoes"].map(part => (
                        todaysOutfit[part] && (
                            <div style={outfitItemStyle} key={part}>
                                <img src={todaysOutfit[part].image_url} alt={todaysOutfit[part].name} style={outfitImageStyle} />
                                <p>{todaysOutfit[part].name}</p>
                            </div>
                        )
                    ))}
                    {todaysOutfit.accessories.map((accessory, index) => (
                        <div style={outfitItemStyle} key={`accessory-${index}`}>
                            <img src={accessory.image_url} alt={accessory.name} style={outfitImageStyle} />
                            <p>{accessory.name}</p>
                        </div>
                    ))}
                </div>
                <div style={chooseButtonWrapperStyle}>
    <Link to="/makeoutfit" style={chooseButtonStyle}>
        Choose Outfit
    </Link>
</div>
            </div>
        </div>
    );
}
export default OutfitSuggestionPage;
