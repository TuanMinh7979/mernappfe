import { useRoutes } from 'react-router-dom';
import Login from '@pages/auth/login/Login';
import ProtectedRoute from '@pages/ProtectedRoute';
import Error from '@pages/error/Error';
import { Suspense, lazy } from 'react';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import NotificationSkeleton from '@pages/social/notifications/NotificationsSkeleon';
import CardSkeleton from '@components/card-element/CardSkeleton';
import Register from '@pages/auth/register/Register';
const Social = lazy(() => import('@pages/social/Socical'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Follower = lazy(() => import('@pages/social/follower/Follower'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Notifications = lazy(() => import('@pages/social/notifications/Notification'));
const People = lazy(() => import('@pages/social/people/People'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));

const Profile = lazy(() => import('@pages/social/profile/Profile'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));

const AppRouter = () => {
    const elements = useRoutes([
        {
            path: '/',
            element: <Login />
        },
        {
            path: '/signup',
            element: <Register />
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
                    element: 
                    <Suspense fallback={<StreamsSkeleton />}>
                        <Streams></Streams>
                        
                        </Suspense>
                },
                {
                    path: "chat/messages",
                    element: <Suspense><Chat></Chat></Suspense>
                },
                {
                    path: "people",
                    element: <Suspense fallback={<CardSkeleton />}><People></People></Suspense>
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
                    element: <Suspense fallback={<NotificationSkeleton />}><Notifications></Notifications></Suspense>
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