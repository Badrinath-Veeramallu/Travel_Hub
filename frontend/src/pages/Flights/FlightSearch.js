import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightPages.css';

const AIRPORTS = [
  { code: 'DEL', name: 'Delhi' },
  { code: 'BOM', name: 'Mumbai' },
  { code: 'BLR', name: 'Bangalore' },
  { code: 'HYD', name: 'Hyderabad' },
  { code: 'GOI', name: 'Goa' },
  { code: 'MAA', name: 'Chennai' },
  { code: 'CCU', name: 'Kolkata' },
  { code: 'PNQ', name: 'Pune' },
  { code: 'JAI', name: 'Jaipur' }
];

const TODAY = new Date().toISOString().split('T')[0];
const TOMORROW = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const WEEK_LATER = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

export default function FlightSearch() {
  const navigate = useNavigate();
  const [showTravellers, setShowTravellers] = useState(false);
  const [form, setForm] = useState({
    from: 'HYD',
    to: 'DEL',
    departureDate: TOMORROW,
    returnDate: WEEK_LATER,
    tripType: 'roundtrip',
    adults: 1,
    children: 0,
    infants: 0,
    cabin: 'economy'
  });

  const totalTravellers = form.adults + form.children + form.infants;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fromAirport = AIRPORTS.find(a => a.code === form.from);
    const toAirport = AIRPORTS.find(a => a.code === form.to);
    const searchParams = {
      ...form,
      fromLabel: fromAirport ? `${fromAirport.code} (${fromAirport.name})` : form.from,
      toLabel: toAirport ? `${toAirport.code} (${toAirport.name})` : form.to
    };
    navigate('/flights/results', { state: { searchParams } });
  };

  return (
    <div className="flight-search-page">
      <div className="search-page-hero">
        <h1>✈️ Search Flights</h1>
        <p>Find and compare the best deals across all major airlines</p>
      </div>

      <div className="container">
        <div className="search-card">
          <form onSubmit={handleSubmit}>
            <div className="trip-type">
              <label>
                <input type="radio" name="tripType" value="roundtrip"
                  checked={form.tripType === 'roundtrip'} onChange={handleChange} />
                Round Trip
              </label>
              <label>
                <input type="radio" name="tripType" value="oneway"
                  checked={form.tripType === 'oneway'} onChange={handleChange} />
                One Way
              </label>
            </div>

            <div className="search-fields-grid">
              <div className="form-group">
                <label>From</label>
                <select name="from" value={form.from} onChange={handleChange}>
                  {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} – {a.name}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="swap-btn"
                  onClick={() => setForm(p => ({ ...p, from: p.to, to: p.from }))}
                >
                  ⇄
                </button>
              </div>

              <div className="form-group">
                <label>To</label>
                <select name="to" value={form.to} onChange={handleChange}>
                  {AIRPORTS.map(a => <option key={a.code} value={a.code}>{a.code} – {a.name}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Departure</label>
                <input type="date" name="departureDate" value={form.departureDate}
                  min={TODAY} onChange={handleChange} required />
              </div>

              {form.tripType === 'roundtrip' && (
                <div className="form-group">
                  <label>Return</label>
                  <input type="date" name="returnDate" value={form.returnDate}
                    min={form.departureDate || TODAY} onChange={handleChange} />
                </div>
              )}

              <div className="form-group" style={{ position: 'relative' }}>
                <label>Travellers &amp; Class</label>
                <div className="traveller-display" onClick={() => setShowTravellers(!showTravellers)}>
                  {totalTravellers} Traveller{totalTravellers !== 1 ? 's' : ''} · {form.cabin.charAt(0).toUpperCase() + form.cabin.slice(1)}
                  <span>▾</span>
                </div>
                {showTravellers && (
                  <div className="traveller-dropdown">
                    {[
                      { key: 'adults', label: 'Adults', note: '12+ years', min: 1 },
                      { key: 'children', label: 'Children', note: '2–11 years', min: 0 },
                      { key: 'infants', label: 'Infants', note: 'Under 2 years', min: 0 }
                    ].map(({ key, label, note, min }) => (
                      <div key={key} className="traveller-row">
                        <div>
                          <div className="traveller-type">{label}</div>
                          <div className="traveller-note">{note}</div>
                        </div>
                        <div className="counter">
                          <button type="button" onClick={() => setForm(p => ({ ...p, [key]: Math.max(min, p[key] - 1) }))}>−</button>
                          <span>{form[key]}</span>
                          <button type="button" onClick={() => setForm(p => ({ ...p, [key]: Math.min(9, p[key] + 1) }))}>+</button>
                        </div>
                      </div>
                    ))}
                    <div className="traveller-row">
                      <label style={{ fontWeight: 600, fontSize: '14px' }}>Cabin</label>
                      <select name="cabin" value={form.cabin} onChange={handleChange} style={{ width: '140px' }}>
                        <option value="economy">Economy</option>
                        <option value="premium-economy">Premium Economy</option>
                        <option value="business">Business</option>
                        <option value="first">First Class</option>
                      </select>
                    </div>
                    <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}
                      onClick={() => setShowTravellers(false)}>Done</button>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-search-large">
              🔍 Search Flights
            </button>
          </form>
        </div>

        {/* Quick Route Cards */}
        <div className="popular-routes">
          <h2>Popular Routes</h2>
          <div className="routes-grid">
            {[
              { from: 'HYD', to: 'DEL', label: 'Hyderabad → Delhi' },
              { from: 'BOM', to: 'DEL', label: 'Mumbai → Delhi' },
              { from: 'BLR', to: 'DEL', label: 'Bangalore → Delhi' },
              { from: 'DEL', to: 'GOI', label: 'Delhi → Goa' }
            ].map(route => (
              <div
                key={route.from + route.to}
                className="route-card"
                onClick={() => setForm(p => ({ ...p, from: route.from, to: route.to }))}
              >
                <span className="route-text">{route.label}</span>
                <span className="route-arrow">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
