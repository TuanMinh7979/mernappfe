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
import { getAPI } from '@services/utils/fetchData';
import { BASE_URL } from '@services/axios';


const ProtectedRoute = ({ children }) => {
  const { profile, token } = useSelector((state) => state.user);

  const [tokenIsValid, setTokenIsValid] = useState(false);

  const logged = useSessionStorage('logged', 'get');

  const [deleteSessionPageReload] = useSessionStorage('logged', 'delete');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const response = await getAPI(`/refresh_token`, token)
      // dispatch(getConversationList())
      setTokenIsValid(true);
      console.log(response.data);
      dispatch(updateLoggedUser({ token: response.data.token, profile: response.data.user }));
    } catch (error) {
      console.log(error);
      setTokenIsValid(false);
      setTimeout(async () => {
        Utils.clearStore({ dispatch, deleteSessionPageReload, });
        await userService.logoutUser();
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