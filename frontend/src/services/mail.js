import axios from '../api/axios';


export const getInbox = () => {
  return axios.get(`mails/`);
};

export const fetchMailsByCategory = async (category) => {
  const url = category
    ? `mails/category/?type=${category}`
    : `mails/category/`;

  const response = await axios.get(url);

  return response.data;
};

export const getMailDetail = (id) => {
  return axios.get(`mails/${id}/`);
};

export const sendMail = (mailData) => {
  return axios.post('mails/', mailData);
};

export const markAsRead = (id) => {
  return axios.patch(`mails/${id}/mark_as_read/`);
};

export const moveToSpam = (id) => {
  return axios.patch(`mails/${id}/`);
};

export const deleteMail = (id) => {
  return axios.patch(`mails/${id}/delete_mail/`);
};
  
