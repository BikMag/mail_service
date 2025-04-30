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
  return axios.get(`mails/${id}/`);
};

export const sendMail = (mailData) => {
  return axios.post('mails/', mailData);
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
  
