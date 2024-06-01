import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Espansioni_page from './pages/Expansions';
import Carte from './pages/Cards_page';
import CardDetails from './pages/CardDetails'; 

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Espansioni" element={<Espansioni_page />} />
            <Route path="/Carte" element={<Carte />} />
            <Route path="/card-details/:id" element={<CardDetails />} />
        </Routes>
    </Router>,
    document.getElementById('root')
);
