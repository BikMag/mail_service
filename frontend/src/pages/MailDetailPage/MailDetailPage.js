import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getMailDetail, markAsRead } from '../../services/mail';
import './MailDetailPage.css';

const MailDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mail, setMail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMail = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await getMailDetail(id, token);
        setMail(response.data);
        await markAsRead(id, true);
      } catch (err) {
        console.error('Ошибка загрузки письма', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMail();
  }, [id, navigate]);

  if (loading) return <p>Загрузка письма...</p>;
  if (!mail) return <p>Письмо не найдено.</p>;

  return (
    <div className="mail-detail">
      <h2>Тема: {mail.subject}</h2>
      <p><strong>От:</strong> {mail.sender_email || mail.sender.username}</p>
      <p><strong>Кому:</strong> {mail.recipient_email || mail.recipient.username}</p>
      <p><strong>Дата:</strong> {new Date(mail.sent_at).toLocaleString()}</p>
      <hr />
      <p>{mail.body}</p>

      <button onClick={() => navigate(-1)}>Назад</button>
    </div>
  );
};

export default MailDetailPage;
