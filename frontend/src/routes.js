import MailPage from './pages/MailPage/MailPage';
// import SentPage from './pages/SentPage';
import ComposePage from './pages/ComposePage/ComposePage';
import MailDetailPage from './pages/MailDetailPage/MailDetailPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
 
const routes = [
  { path: '/', component: MailPage },
//   { path: '/sent', component: SentPage },
  { path: '/compose', component: ComposePage },
  { path: '/mails/:id', component: MailDetailPage },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
];

export default routes;
