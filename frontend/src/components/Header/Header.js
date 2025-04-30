import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/auth';
import logo from '../../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('auth_token');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const response = await getCurrentUser();
        setUsername(response.data.username);
      } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Логотип и название */}
        <div className="d-flex align-items-center">
          <img src={logo} alt="Mail Service Logo" width="36" height="36" className="me-2" />
          <span className="navbar-brand mb-0 h1">Mail Service</span>
        </div>

        {/* Навигация */}
        <div className="d-flex align-items-center gap-3">
          {token ? (
            <>
              <Link to="/" className="nav-link text-white">Письма</Link>
              <Link to="/compose" className="nav-link text-white">Написать письмо</Link>
              <span className="text-white">
                <i className="bi bi-person-fill me-1" />
                <em>{username}</em>
              </span>
              <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>Выйти</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link text-white">Вход</Link>
              <Link to="/register" className="nav-link text-white">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
