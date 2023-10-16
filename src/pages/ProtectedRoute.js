
import useSessionStorage from '@hooks/useSessionStorage';

import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { authService } from '@services/api/auth/auth.service';



const ProtectedRoute = ({ children }) => {
  const { profile, token } = useSelector((state) => state.user);
  const logged = useSessionStorage('logged', 'get');

  if (logged || (profile && token)) {

      return <>{children}</>;
    
  } else {
    return <>{<Navigate to="/" />}</>;
  }
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;