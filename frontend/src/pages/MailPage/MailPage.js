import React, { useEffect, useState } from 'react';
import { 
  fetchMailsByCategory,
  markAsRead,
  moveToSpam,
  deleteMail 
} from '../../services/mail';
import { Link } from 'react-router-dom';
import { useCategory } from '../../contexts/CategoryContext';
import './MailPage.css';
import { Dropdown } from 'react-bootstrap';
import moment from 'moment';

function MailPage() {
  const { category } = useCategory();
  const [mails, setMails] = useState([]);

  const fetchMails = async () => {
    try {
      const data = await fetchMailsByCategory(category);
      setMails(data);
    } catch (error) {
      console.error('Ошибка загрузки писем:', error);
    }
  };

  useEffect(() => {
    fetchMails();
  }, [category]);

  const onAction = async (mailId, action) => {
    try {
      if (action === 'read') {
        await markAsRead(mailId);
      } else if (action === 'spam') {
        await moveToSpam(mailId);
      } else if (action === 'delete') {
        await deleteMail(mailId);
      }
      await fetchMails(); // обновим список после действия
    } catch (error) {
      console.error(`Ошибка при выполнении действия "${action}":`, error);
    }
  };

  return (
    <div className="">
      <h2>Почта</h2>
      {mails.length === 0 ? (
        <p>Нет писем.</p>
      ) : (
        <div className="list-group">
          {mails.map((mail) => (
            <div
              key={mail.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-start"
            >
              <Link
                to={`/mails/${mail.id}`}
                className="text-decoration-none text-body w-100"
                
              >
                <div className="d-flex justify-content-between">
                  <h5 className="mb-1 pe-2">
                    {mail.subject.length > 40 ? `${mail.subject.slice(0, 40)}...` : mail.subject} ({mail.is_read ? 'прочитано' : 'не прочитано'})
                  </h5>
                  <small className="text-muted">
                    {moment(mail.sent_at).format('DD.MM.YYYY HH:mm')}
                  </small>
                </div>
                <p
                  className="mb-1"
                  style={{
                    maxHeight: '1.5em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {mail.body}
                </p>
                <small className="text-muted">
                  {category === 'sent'
                    ? `Кому: ${mail.recipient.email}`
                    : `От: ${mail.sender.email}`}
                </small>
              </Link>

              <Dropdown className="ms-3">
                <Dropdown.Toggle variant="secondary" size="sm" id={`dropdown-${mail.id}`}>
                  Действия
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => onAction(mail.id, 'read')}>
                    Отметить как прочитанное
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onAction(mail.id, 'spam')}>
                    Переместить в спам
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onAction(mail.id, 'delete')}>
                    Удалить
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MailPage;
