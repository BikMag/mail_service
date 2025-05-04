import axios from '../api/axios';


export const getInbox = () => {
  return axios.get(`/api/mails/`);
};

export const fetchMailsByCategory = async (category, page = 1) => {
  const url = category
    ? `/api/mails/category/?page=${page}&type=${category}`
    : `/api/mails/category/?page=${page}`;

  const response = await axios.get(url);

  return response.data;
};

export const getMailDetail = (id) => {
  return axios.get(`/api/mails/${id}/`, {
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  });
};

export const sendMail = (mailData) => {
  return axios.post('/api/mails/', mailData, {
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  });
};

export const markAsRead = (id, state) => {
  return axios.patch(`/api/mails/${id}/`, {is_read: state});
};

export const moveToSpam = (id, state) => {
  return axios.patch(`/api/mails/${id}/`, {is_spam: state});
};

export const deleteOrRestoreMail = (id) => {
  return axios.patch(`/api/mails/${id}/delete_or_restore_mail/`);
};

export const deleteMailForever = (id) => {
  return axios.delete(`/api/mails/${id}/`);
};

// export const downloadFile = async (id, filename) => {
//   return axios.get(`attachments/${id}/download`);
// };
  
