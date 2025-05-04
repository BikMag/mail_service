import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { downloadFile, getMailDetail, markAsRead } from '../../services/mail';
// import './MailDetailPage.css';

const getIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼';
      case 'zip':
      case 'rar':
      case '7z':
        return '📦';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽';
      default:
        return '📎';
    }
};

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

        const response = await getMailDetail(id);
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
    <div className="container py-4">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title mb-3">Тема: {mail.subject}</h4>

          <div className="mb-2">
            <p className="mb-1"><strong>От:</strong> {mail.sender?.email || mail.sender_email || mail.sender?.username}</p>
            <p className="mb-1"><strong>Кому:</strong> {mail.recipient?.email || mail.recipient_email || mail.recipient?.username}</p>
            <p className="mb-1"><strong>Дата:</strong> {new Date(mail.sent_at).toLocaleString()}</p>
          </div>

          <hr />

          <p className="card-text">{mail.body}</p>

          {mail.attachments?.length > 0 && (
            <div className="mt-4">
              <h5>Вложения:</h5>
              <ul className="list-group list-group-flush">
                {mail.attachments.map((file) => (
                  <li key={file.id} className="list-group-item">
                    <a
                      href={file.file_url || file.file}
                      download
                      onClick={(e) => {
                        e.preventDefault();
                        const link = document.createElement('a');
                        link.href = file.file_url || file.file;
                        link.download = file.filename || 'attachment';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      {getIcon(file.filename)} {file.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="btn btn-secondary mt-4" onClick={() => navigate(-1)}>← Назад</button>
        </div>
      </div>
    </div>
  );
};

export default MailDetailPage;
