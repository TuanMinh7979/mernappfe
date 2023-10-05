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
import { getConversationList } from '@redux/api/chat';


const ProtectedRoute = ({ children }) => {
  const { profile, token } = useSelector((state) => state.user);

  const [tokenIsValid, setTokenIsValid] = useState(false);

  const logged = useSessionStorage('logged', 'get');

  const [deleteSessionPageReload] = useSessionStorage('logged', 'delete');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkUser = useCallback(async () => {
    try {
      const response = await userService.checkCurrentUser();
      dispatch(getConversationList())

      setTokenIsValid(true);
      dispatch(updateLoggedUser({ token: response.data.token, profile: response.data.user }));
    } catch (error) {

      setTokenIsValid(false);
      setTimeout(async () => {
        Utils.clearStore({ dispatch, deleteSessionPageReload, });
        await userService.logoutUser();
        navigate('/');
      }, 1000);
    }
  }, [dispatch, navigate, , deleteSessionPageReload,]);

  useEffectOnce(() => {
    

      checkUser();
    
  });

  if (logged || (profile && token)) {
    if (!tokenIsValid) {
      //when reload refresh login session user time if logged == true => render empty
      return <>REFRESH NEW TOKEN FOR LOGIN SESSION USER</>;
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