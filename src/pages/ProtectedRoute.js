import useEffectOnce from '@hooks/useEffectOnce';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { updateLoggedUser } from '@redux/reducers/user/user.reducer';
import { userService } from '@services/api/user/user.service';
import { Utils } from '@services/utils/utils.service';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchConversationList } from '@redux/api/chat';
import { authService } from '@services/api/auth/auth.service';



const ProtectedRoute = ({ children }) => {
  const { profile, token } = useSelector((state) => state.user);

  const [tokenIsValid, setTokenIsValid] = useState(false);

  const logged = useSessionStorage('logged', 'get');

  const [deleteSessionPageReload] = useSessionStorage('logged', 'delete');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const response = await authService.refreshToken(token)
      dispatch(fetchConversationList(token))
      
      setTokenIsValid(true);
      console.log(response.data);
      dispatch(updateLoggedUser({ token: response.data.token, profile: response.data.user }));
    } catch (error) {
      console.log(error);
      setTokenIsValid(false);
      setTimeout(async () => {
        Utils.clearStore({ dispatch, deleteSessionPageReload, });
        await userService.logoutUser(token);
        navigate('/');
      }, 1000);
    }
  }, [dispatch, navigate, deleteSessionPageReload,]);

  useEffectOnce(() => {


    refreshToken();

  });

  if (logged || (profile && token)) {
    if (!tokenIsValid) {

    } else {
      return <>{children}</>;
    }
  } else {
    return <>{<Navigate to="/" />}</>;
  }
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;