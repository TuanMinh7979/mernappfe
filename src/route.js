import AuthTabs from '../src/pages/auth/tabs/AuthTabs';
import { useRoutes } from 'react-router-dom';
import ForgotPassword from './pages/auth/forgot-password/ForgotPassword';


const AppRouter = () => {
    const elements = useRoutes([
        {
            path: '/',
            element: <AuthTabs />
        },
        {
            path: '/forgot-password',
            element: <ForgotPassword />
        },

    ]);

    return elements;
};

export default AppRouter