import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import WardrobePage from './WardrobePage';
import OutfitPage from './OutfitSuggestions';
import MakeOutfitPage from './Makeoutfit';
import SignupPage from './SignupPage'; 
import LoginPage from './Login'; 
import FavoritesPage from './favouritePage';
import ViewItemsPage from './ViewItemsPage';
import Calendarpage from './calender';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dash" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/wardrobe" element={<WardrobePage />} />
        <Route path="/outfits" element={<OutfitPage />} />
        <Route path="/calender" element={<Calendarpage />} />
        <Route path="/favourite" element={<FavoritesPage />} />
        <Route path="/view-items" element={<ViewItemsPage />} />
        <Route path="/makeoutfit" element={<MakeOutfitPage />} />
      </Routes>
    </Router>
  );
};
export default App;
