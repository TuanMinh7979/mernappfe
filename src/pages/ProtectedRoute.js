
import useSessionStorage from '@hooks/useSessionStorage';

import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { freshAccessToken } from '@services/utils/tokenUtils';
import { useEffect } from 'react';
import { useState } from 'react';
import useEffectOnce from '@hooks/useEffectOnce';
import { useCallback } from 'react';






const ProtectedRoute = ({ children }) => {
  const { profile, token } = useSelector((state) => state.user);
  const dispatch = useDispatch()
  const [tkValid, setTkValid] = useState(false)




  const checkUser = async () => {
    try {
      if (!sessionStorage.getItem("accessToken")) return
      const a= await freshAccessToken(sessionStorage.getItem("accessToken"), dispatch)
      console.log("abccccccccccccccccc");
      setTkValid(true);

    } catch (error) {
      setTkValid(false)


    }
  };

  useEffectOnce(() => {


    checkUser();

  });






  if (sessionStorage.getItem('accessToken')) {
    if (!tkValid ) {
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