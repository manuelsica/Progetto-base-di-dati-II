import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Espansioni_page from './pages/Expansions';
import Deck from './pages/Deck';
import EspansioniCarte from './pages/EspansioniCarte';
import Carte from './pages/Cards_page';
import CardDetails from './pages/CardDetails';
import DeckDetails from './pages/DeckDetails';  // Import the new DeckDetails component
import axios from 'axios';

axios.defaults.withCredentials = true;


ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Espansioni" element={<Espansioni_page />} />
            <Route path="/Deck" element={<Deck />} />
            <Route path="/expansion-cards/:setId" element={<EspansioniCarte />} />
            <Route path="/Carte" element={<Carte />} />
            <Route path="/card-details/:id" element={<CardDetails />} />
            <Route path="/deck-details/:id" element={<DeckDetails />} /> {/* Add the new route */}
        </Routes>
    </Router>,
    document.getElementById('root')
);


