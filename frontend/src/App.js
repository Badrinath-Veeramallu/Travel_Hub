import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Pages
import Home from './pages/Home/Home';
import FlightSearch from './pages/Flights/FlightSearch';
import FlightResults from './pages/Flights/FlightResults';
import FlightDetails from './pages/Flights/FlightDetails';
import HotelSearch from './pages/Hotels/HotelSearch';
import HotelResults from './pages/Hotels/HotelResults';
import HotelDetails from './pages/Hotels/HotelDetails';
import CarSearch from './pages/Cars/CarSearch';
import CarResults from './pages/Cars/CarResults';
import CarDetails from './pages/Cars/CarDetails';
import Trips from './pages/Trips/Trips';
import Help from './pages/Help/Help';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Profile from './pages/Auth/Profile';
import BookingSummary from './pages/Booking/BookingSummary';
import NotFound from './pages/NotFound/NotFound';

// Styles
import './styles/globals.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CurrencyProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Flights */}
                <Route path="/flights" element={<FlightSearch />} />
                <Route path="/flights/results" element={<FlightResults />} />
                <Route path="/flights/:id" element={<FlightDetails />} />

                {/* Hotels */}
                <Route path="/hotels" element={<HotelSearch />} />
                <Route path="/hotels/results" element={<HotelResults />} />
                <Route path="/hotels/:id" element={<HotelDetails />} />

                {/* Cars */}
                <Route path="/cars" element={<CarSearch />} />
                <Route path="/cars/results" element={<CarResults />} />
                <Route path="/cars/:id" element={<CarDetails />} />

                {/* Trips */}
                <Route path="/trips" element={<Trips />} />

                {/* Help */}
                <Route path="/help" element={<Help />} />

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/profile" element={<Profile />} />

                {/* Booking */}
                <Route path="/booking-summary" element={<BookingSummary />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CurrencyProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
