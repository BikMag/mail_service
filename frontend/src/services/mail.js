import axios from '../api/axios';


export const getInbox = () => {
  return axios.get(`mails/`);
};

export const fetchMailsByCategory = async (category, page = 1) => {
  const url = category
    ? `mails/category/?page=${page}&type=${category}`
    : `mails/category/?page=${page}`;

  const response = await axios.get(url);

  return response.data;
};

export const getMailDetail = (id) => {
  return axios.get(`mails/${id}/`, {
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  });
};

export const sendMail = (mailData) => {
  return axios.post('mails/', mailData, {
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  });
};

export const markAsRead = (id, state) => {
  return axios.patch(`mails/${id}/`, {is_read: state});
};

export const moveToSpam = (id, state) => {
  return axios.patch(`mails/${id}/`, {is_spam: state});
};

export const deleteOrRestoreMail = (id) => {
  return axios.patch(`mails/${id}/delete_or_restore_mail/`);
};

export const deleteMailForever = (id) => {
  return axios.delete(`mails/${id}/`);
};

export const downloadFile = async (id, filename) => {
  const token = localStorage.getItem('auth_token');
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}attachments/${id}/download/`, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки файла');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename || 'file');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
};
  
