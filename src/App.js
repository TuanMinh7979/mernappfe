import { BrowserRouter } from 'react-router-dom';
import AppRouter from './route';
import { useEffect } from 'react';
import './App.scss'
import { socketService } from '@services/socket/socket.service';
import Toast from '@components/toast/Toast';
import checkIcon from '@assets/images/check.svg'
import errorIcon from '@assets/images/error.svg'
import infoIcon from '@assets/images/info.svg'
import warningIcon from '@assets/images/warning.svg'
const App = () => {
  const notifications = [
    {
      id: 1,
      description: "This is a success message",
      type: 'success',
      icon: checkIcon,
      backgroundColor: "green"

    },
   

  ]
  useEffect(() => {
    socketService.setupSocketConnection()
  }, [])
  return <>
    {notifications && notifications.length > 0 &&
      <Toast
        position="top-right"
        toastList={notifications}
        autoDelete={false}

      />
    }
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </>

}
export default App