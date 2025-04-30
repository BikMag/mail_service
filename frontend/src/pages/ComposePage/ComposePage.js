import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMail } from '../../services/mail';
import './ComposePage.css';

const ComposePage = () => {
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }
      await sendMail({ recipient_email: recipientEmail, subject, body }, token);
      navigate('/'); // после отправки — на главную
    } catch (err) {
      console.error('Ошибка отправки письма:', err);
      setError('Не удалось отправить письмо. Проверьте правильность данных.');
    }
  };

  return (
    <div className="compose-page">
      <h2>Создать новое письмо</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email получателя:</label>
          <input
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Тема:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Текст письма:</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="8"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default ComposePage;
