import AuthTabs from '../src/pages/auth/tabs/AuthTabs';
import { useRoutes } from 'react-router-dom';


const AppRouter = () => {
    const elements = useRoutes([
        {
            path: '/',
            element: <AuthTabs />
        },

    ]);

    return elements;
};

export default AppRouter