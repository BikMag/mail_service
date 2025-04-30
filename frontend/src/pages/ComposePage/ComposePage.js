import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMail } from '../../services/mail';
// import './ComposePage.css';

const ComposePage = () => {
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState([]);

  const handleFileChange = (e) => {
    setAttachments(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('recipient_email', recipientEmail);
    formData.append('subject', subject);
    formData.append('body', body);

    for (let i = 0; i < attachments.length; i++) {
      formData.append('attachments', attachments[i]);
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }
      await sendMail(formData);
      navigate('/'); // после отправки — на главную
    } catch (err) {
      console.error('Ошибка отправки письма:', err);
      setError('Не удалось отправить письмо. Проверьте правильность данных.');
    }
  };

  return (
    <div className="container">
      <h2>Отправить письмо</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Получатель</label>
          <input type="email" className="form-control" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Тема</label>
          <input type="text" className="form-control" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Сообщение</label>
          <textarea className="form-control" rows="5" value={body} onChange={(e) => setBody(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Вложения</label>
          <input type="file" className="form-control" multiple onChange={handleFileChange} />
        </div>
        {error && <><p style={{color: 'red'}}>{error}</p></>}
        <button type="submit" className="btn btn-primary">Отправить</button>
      </form>
    </div>
  );
};

export default ComposePage;
