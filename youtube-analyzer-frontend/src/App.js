import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import HomePage from './components/HomePage';
import './App.css';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(120deg, #e0f7fa, #fce4ec);
  font-family: 'Inter', sans-serif;
`;

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;