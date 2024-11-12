import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ParkingSpotIndex from './pages/parking-spot';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/parking-spot" element={<ParkingSpotIndex />} />
      </Routes>
    </Router>
  );
};

export default App;
