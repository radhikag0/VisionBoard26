import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import MoodBoard from './pages/MoodBoard';
import TodoList from './pages/TodoList';
import Goals from './pages/Goals';
import Gallery from './pages/Gallery';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/moodboard" element={<MoodBoard />} />
          <Route path="/todos" element={<TodoList />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;