import React from 'react';
import { useCategory } from '../../contexts/CategoryContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const { category, setCategory } = useCategory();
  const navigate = useNavigate();

  const categories = [
    { label: 'Входящие', value: 'inbox' },
    { label: 'Отправленные', value: 'sent' },
    { label: 'Удалённые', value: 'deleted' },
    { label: 'Спам', value: 'spam' }
  ];

  const handleCategoryChange = (value) => {
    setCategory(value);
    navigate('/'); // Переход на главную
  };

  return (
    <aside className="sidebar bg-light shadow-sm" 
        style={{ width: '250px', minWidth: '250px' }}
    >
      <div className="list-group list-group-flush">
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`list-group-item list-group-item-action ${category === cat.value ? 'active' : ''}`}
            onClick={() => handleCategoryChange(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="mt-3 mb-3 d-flex justify-content-center">
        <button
          className="btn btn-success"
          style={{ width: '80%' }}
          onClick={() => {
            setCategory('inbox');
            navigate('/compose');
          }}
        >
          ✉ Отправить письмо
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
