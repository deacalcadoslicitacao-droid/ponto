import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div>
      <header style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <span style={{ marginLeft: 10 }}>{user.name} ({user.role})</span>
            <button style={{ marginLeft: 10 }} onClick={logout}>Logout</button>
          </>
        ) : (
          <Link style={{ marginLeft: 10 }} to="/login">Login</Link>
        )}
      </header>
      <main style={{ padding: 10 }}>
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              {user?.role === 'admin' ? <AdminDashboard/> : <UserDashboard/>}
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login/>} />
          <Route path="/admin/*" element={<PrivateRoute adminOnly><AdminDashboard/></PrivateRoute>} />
          <Route path="/user/*" element={<PrivateRoute><UserDashboard/></PrivateRoute>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;