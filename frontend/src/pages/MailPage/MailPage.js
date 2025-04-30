import React, { useEffect, useState } from 'react';
import { 
  fetchMailsByCategory,
  markAsRead,
  moveToSpam,
  deleteOrRestoreMail,
  deleteMailForever 
} from '../../services/mail';
import { Link } from 'react-router-dom';
import { useCategory } from '../../contexts/CategoryContext';
import './MailPage.css';
import { Dropdown, Pagination } from 'react-bootstrap';
import moment from 'moment';

function MailPage() {
  const { category } = useCategory();
  const [mails, setMails] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [count, setCount] = useState(0);

  const categoriesNames = {
    'inbox': 'Входящие',
    'sent': 'Отправленные',
    'spam': 'Спам',
    'deleted': 'Корзина'
  };

  const fetchMails = async () => {
    try {
      const data = await fetchMailsByCategory(category, page);
      setMails(data.results);
      setHasNext(!!data.next);
      setCount(data.count);
    } catch (error) {
      console.error('Ошибка загрузки писем:', error);
    }
  };

  useEffect(() => {
    fetchMails();
  }, [category, page]);

  const onAction = async (mailId, action, state) => {
    try {
      if (action === 'read') {
        await markAsRead(mailId, state);
      } else if (action === 'spam') {
        await moveToSpam(mailId, state);
      } else if (action === 'delete_or_restore') {
        await deleteOrRestoreMail(mailId, state);
      } else if (action === 'delete_forever') {
        await deleteMailForever(mailId);
      }
      await fetchMails(); // обновим список после действия
    } catch (error) {
      console.error(`Ошибка при выполнении действия "${action}":`, error);
    }
  };

  return (
    <div className="">
      <h2>{categoriesNames[category]} (Писем: {count})</h2>
      {mails.length === 0 ? (
        <p>Нет писем.</p>
      ) : (
        <div className="list-group list-group-flush">
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
                  {category === 'sent' ? (
                    <>
                      Кому: <b>{mail.recipient.username}</b> ({mail.recipient.email})
                    </>
                  ) : (
                    <>
                      От: <b>{mail.sender.username}</b> ({mail.sender.email})
                    </>
                  )}
                </small>
              </Link>

              <Dropdown className="ms-3">
                <Dropdown.Toggle variant="secondary" size="sm" id={`dropdown-${mail.id}`}>
                  Действия
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => onAction(mail.id, 'read', !mail.is_read)}>
                    Отметить как {mail.is_read && 'не'}прочитанное
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onAction(mail.id, 'spam', !mail.is_spam)}>
                    {mail.is_spam ? 'Убрать из спама' : 'В спам'}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => onAction(mail.id, 'delete_or_restore')}>
                    {category === 'deleted' ? 'Вытащить из корзины' : 'В корзину'}
                  </Dropdown.Item>

                  {category === 'deleted' && 
                    <Dropdown.Item onClick={() => onAction(mail.id, 'delete_forever')}>
                      Удалить навсегда
                    </Dropdown.Item>
                  }
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ))}
        </div>
      )}
      <Pagination className="mt-3">
        <Pagination.Prev onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} />
        <Pagination.Item active>{page}</Pagination.Item>
        <Pagination.Next onClick={() => setPage(p => p + 1)} disabled={!hasNext} />
      </Pagination>
    </div>
  );
}

export default MailPage;
