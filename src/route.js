import { useRoutes } from 'react-router-dom';
import { AuthTabs, ForgotPassword, ResetPassword } from './pages/auth';
import Streams from '@pages/social/streams/Streams';
import Social from '@pages/social/Socical';
import Follower from '@pages/social/follower/Follower';
import Following from '@pages/social/following/Following';
import Photos from '@pages/social/photos/Photos';
import Profile from '@pages/social/profile/Profile';
import Chat from '@pages/social/chat/Chat';
import People from '@pages/social/people/People';
import Notifications from '@pages/social/notifications/Notifications';
import ProtectedRoute from '@pages/ProtectedRoute';
import Error from '@pages/error/Error';
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
            element:
                <ProtectedRoute>
                    <Social />
                </ProtectedRoute>,
            children: [
                {
                    path: "streams",
                    element: <Streams></Streams>
                },
                {
                    path: "chat/messages",
                    element: <Chat></Chat>
                },
                {
                    path: "people",
                    element: <People></People>
                },
                {
                    path: "followers",
                    element: <Follower></Follower>
                },
                {
                    path: "following",
                    element: <Following></Following>
                },
                {
                    path: "photos",
                    element: <Photos></Photos>
                },
                {
                    path: "notifications",
                    element: <Notifications></Notifications>
                },
                {
                    path: "profile/:username",
                    element: <Profile></Profile>
                },

            ]

        },
        {
            path: '*',
            element: <Error />
        }

    ]);

    return elements;
};

export default AppRouter