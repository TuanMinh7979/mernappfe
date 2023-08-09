import { useRoutes } from 'react-router-dom';
import { AuthTabs, ForgotPassword, ResetPassword } from './pages/auth';
import Streams from '@pages/social/streams/Streams';
import Social from '@pages/social/Socical';
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
        {
            path: '/reset-password',
            element: <ResetPassword />
        },
 
        {
            path: "/app/social",
            element: <Social />,
            children: [
                {
                    path: "streams",
                    element: <Streams></Streams>
                }
            ]

        }

    ]);

    return elements;
};

export default AppRouter