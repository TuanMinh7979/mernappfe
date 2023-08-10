import { BrowserRouter } from 'react-router-dom';
import AppRouter from './route';
import { useEffect } from 'react';
import './App.scss'
import { socketService } from '@services/socket/socket.service';
const App = () => {
  useEffect(() => {
    socketService.setupSocketConnection()
  }, [])
  return <BrowserRouter>
    <AppRouter />
  </BrowserRouter>
}
export default App