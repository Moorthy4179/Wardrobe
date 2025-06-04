import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { Bar, } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const Dashboard = () => {
  const [stats, setStats] = useState({
    wardrobe_items: {},
    calendar_dates: {},
    favorites: 0,
  });
  const [loading, setLoading] = useState(true);
  ChartJS.register(BarElement, CategoryScale, LinearScale, ChartDataLabels);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost/vwobackend/dashboard.php");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div style={styles.container}>
      <Navbar />
      <br /><br /><br />
      {loading ? (
        <p style={styles.loadingText}>Loading dashboard data...</p>
      ) : (
        <div style={styles.dashboardContainer}>
          <div style={styles.card}>
  <h2 style={styles.cardTitle}>Wardrobe Items</h2>
  <Bar 
    data={{
      labels: Object.keys(stats.wardrobe_items),
      datasets: [{
        label: "Count",
        data: Object.values(stats.wardrobe_items),
        backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c"],
        borderColor: "#ddd",
        borderWidth: 1,
      }]
    }}
    options={{
      indexAxis: 'y', 
      plugins: { 
        legend: { display: false },
        datalabels: { 
          anchor: "end", 
          align: "end",
          color: "#333",
          font: { weight: "bold" }
        }
      },
      scales: {
        x: { 
          ticks: { display: false }, 
          beginAtZero: true,
          grid: { display: false }
        },
        y: { 
          ticks: { color: "#333" } 
        }
      }
    }}
  />
</div>
          <div style={styles.card}>
  <h2 style={styles.cardTitle}>Favourites</h2>
   
  count={
     <div style={styles.heartContainer}>
     <FaHeart style={styles.heartIcon} />
     <span style={styles.favoritesCount}>{stats.favorites}</span>
   </div>
  }
  </div>

          <div style={styles.card}>
  <h2 style={styles.cardTitle}>Calendar Saved by Month</h2>
  <Bar 
    data={{
      labels: Object.keys(stats.calendar_dates),
      datasets: [{
        label: "Count",
        data: Object.values(stats.calendar_dates),
        backgroundColor: "#16a085",
        borderColor: "#ddd",
        borderWidth: 1,
      }]
    }}
    options={{
      layout: {
        padding: { top: 20 }  
      },
      plugins: { 
        legend: { display: false },
        datalabels: { 
          anchor: "end",  
          align: "top",  
          color: "#000",  
          font: { weight: "bold", size: 14 },
          formatter: (value) => value, 
          clip: false,  
        }
      },
      scales: {
        x: { 
          ticks: { color: "#333" }, 
          grid: { display: false } 
        },
        y: { 
          ticks: { display: false }, 
          grid: { display: false },
          suggestedMax: Math.max(...Object.values(stats.calendar_dates)) * 1.2 
        }
      }
    }}
  />
</div>


        </div>
      )}
    </div>
  );
};

const DashboardCard = ({ title, count, color, icon, link }) => {
  const handleClick = () => {
    window.location.href = link;
  };

  return (
    <div style={{ ...styles.card, backgroundColor: "#fff", color: "#333", cursor: "pointer" }} onClick={handleClick}>
      <div style={styles.icon}>{icon}</div>
      <h2 style={{ color: color }}>{count}</h2>
      <p>{title}</p>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    minHeight: "100vh",
    padding: "20px",
    backgroundImage: "url('https://www.shutterstock.com/image-photo/analytics-finance-business-concept-big-600nw-2460978993.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "#fff",
  },
  loadingText: {
    fontSize: "18px",
    color: "#555",
    marginTop: "20px",
  },
  dashboardContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center", 
    gap: "20px",
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#fff",
    padding: "15px",  
    borderRadius: "8px",  
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",  
    textAlign: "center",
    width: "550px",  
    height: "250px",  
    flexGrow: 1,
  },
  cardTitle: {
    fontSize: "18px",
    marginBottom: "10px",
    color: "#333",
  },
  icon: {
    fontSize: "40px",
    marginBottom: "10px",
  },
    heartContainer: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "125px",  
      height: "125px",
      borderRadius: "50%",
      background: "#ff4757",
      margin: "10px auto",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
    heartIcon: {
      color: "#fff",
      fontSize: "4rem",  
    },
    favoritesCount: {
      position: "absolute",
      top: "50%", 
      left: "50%", 
      transform: "translate(-50%, -50%)",  
      fontSize: "2rem",
      fontWeight: "bold",
      color: "black",
    },  
};

export default Dashboard;
