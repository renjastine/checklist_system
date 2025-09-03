import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';

import ViewProblem from './pages/viewProblem';
import Dashboard from './pages/dashboard';
import Chatbot from './pages/chatbot';
import Login from './pages/login';
import Admin from './pages/admin';

import './css/addTaskModal.css';
import './css/viewProblem.css';
import './css/new_account.css';
import './css/admin_nav.css';
import './css/navigator.css';
import './css/dashboard.css';
import './css/viewInfo.css';
import './css/account.css';
import './css/chatbot.css';
import './css/general.css';
import './css/login.css';
import './css/admin.css';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/dashboard' element={<Dashboard />}></Route>
          <Route path='/view_problem/:prob_no' element={<ViewProblem />}></Route>
          <Route path='/admin' element={<Admin />}></Route>
          <Route path='/chatbot' element={<Chatbot />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
