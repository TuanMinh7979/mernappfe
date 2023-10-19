

import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useState } from "react";

import {
  isAccessTokenExist,
  isAccessTokenValid,

} from "@services/utils/tokenUtils";
import { getAPI } from "@services/utils/fetchData";
import { updateLoggedUserProfile } from "@redux/reducers/user/user.reducer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Utils } from "@services/utils/utils.service";
const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch()
  const accessTk = sessionStorage.getItem('accessToken')

  const freshLoggedUserData = async () => {
    let existAccessToken = sessionStorage.getItem("accessToken");
    if (!profile && isAccessTokenExist(existAccessToken)) {
      if (isAccessTokenValid(existAccessToken)) {
        try {
          //  fresh current profile
          const res = await getAPI("/current-user", existAccessToken);
      
          dispatch(updateLoggedUserProfile(res.data.user));

        } catch (e) {

          Utils.clearStore(dispatch)
        }
      } else {
        try {
          //  fresh new token and profile
          const res = await getAPI("/refresh_token");
          dispatch(updateLoggedUserProfile(res.data.user));
          sessionStorage.setItem("accessToken", res.data.token);
        } catch (e) { 

          Utils.clearStore(dispatch)


        }
      }
    }
  };

  useEffect(() => {
    freshLoggedUserData()
  }, [])



  const { profile } = useSelector((state) => state.user);
  const [loggedProfileId, setLoggedProfileId] = useState(null)
  useEffect(() => {
    if (profile) {
      setLoggedProfileId(profile._id)
    }

  }, [profile])



  if (accessTk) {
    if (!loggedProfileId) {
      // loading profile or profile and new tokens
      //when reload refresh login session user time if logged == true => render empty
      return <></>;
    } else {
      return <>{children}</>;
    }
  } else {
    return <>{<Navigate to="/" />}</>;
  }

};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
