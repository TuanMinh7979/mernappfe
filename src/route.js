import { useRoutes } from 'react-router-dom';
import { AuthTabs, ForgotPassword, ResetPassword } from './pages/auth';
// import Streams from '@pages/social/streams/Streams';
// import Social from '@pages/social/Socical';
// import Follower from '@pages/social/follower/Follower';
// import Following from '@pages/social/following/Following';
// import Photos from '@pages/social/photos/Photos';
// import Profile from '@pages/social/profile/Profile';
// import Chat from '@pages/social/chat/Chat';
// import People from '@pages/social/people/People';
// import Notifications from '@pages/social/notifications/Notifications';
import ProtectedRoute from '@pages/ProtectedRoute';
import Error from '@pages/error/Error';
import { Suspense, lazy } from 'react';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
const Social = lazy(() => import('@pages/social/Socical'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Follower = lazy(() => import('@pages/social/follower/Follower'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Notifications = lazy(() => import('@pages/social/notifications/Notifications'));
const People = lazy(() => import('@pages/social/people/People'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));

const Profile = lazy(() => import('@pages/social/profile/Profile'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));

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
                    element: <Suspense fallback={StreamsSkeleton}><Streams></Streams></Suspense>
                },
                {
                    path: "chat/messages",
                    element: <Suspense><Chat></Chat></Suspense>
                },
                {
                    path: "people",
                    element:  <Suspense><People></People></Suspense>
                },
                {
                    path: "followers",
                    element: <Suspense><Follower></Follower></Suspense>
                },
                {
                    path: "following",
                    element: <Suspense><Following></Following></Suspense>
                },
                {
                    path: "photos",
                    element: <Suspense><Photos></Photos></Suspense>
                },
                {
                    path: "notifications",
                    element: <Suspense><Notifications></Notifications></Suspense>
                },
                {
                    path: "profile/:username",
                    element: <Suspense><Profile></Profile></Suspense>
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