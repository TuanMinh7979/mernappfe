import jwt_decode from "jwt-decode";
import { updateLoggedUserProfile } from "@redux/reducers/user/user.reducer";

import { getAPI } from "./fetchData";
import { Utils } from "./utils.service";

export const newestAccessToken = async (dispatch) => {
  const existAccessToken = localStorage.getItem("accessToken");

  // if exist

  if (isAccessTokenValid(existAccessToken)) {
    return existAccessToken;
  }
  // if exist and not valid
  try {
    Utils.displayInfo("Refreshing token", dispatch, true)
    const res = await getAPI(`/refresh_token`);
    dispatch(updateLoggedUserProfile(res.data.user));
    localStorage.setItem("accessToken", res.data.token);
    return res.data.token;
  } catch (e) {
    Utils.displayError(e, dispatch, 1)
    Utils.clearStore(dispatch);
    // server also remove rf_token in cookies if server refresh error 
    return existAccessToken;
  }

};

export const isAccessTokenExist = (tk) => {
  return tk;
};

export const isAccessTokenValid = (tk) => {
  if (!tk) return false;
  const access_tokenDecode = jwt_decode(tk);
  return access_tokenDecode.exp >= Date.now() / 1000;
};

export const isRfTokenValid = (tk) => {
  if (!tk) return false;
  const rfTokenDecode = jwt_decode(tk);
  return rfTokenDecode.exp >= Date.now() / 1000;
};





export const getAccessTokenExp = (access_token) => {
  const accessTokenDecode = jwt_decode(access_token);

  if (accessTokenDecode.exp <= Date.now() / 1000) {
    return "expired";
  }
  return accessTokenDecode.exp;
};

export const checkRfExp = (exp) => {


  if (exp <= Date.now() / 1000) {
    return "expired";
  }
  return exp;
};
