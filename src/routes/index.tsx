import { createBrowserRouter } from 'react-router-dom';
import Chat from '@/components/chat/chat';
import Home from '@/pages/home';
import Login from '@/pages/Login';
import NotFound from '@/pages/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]); 