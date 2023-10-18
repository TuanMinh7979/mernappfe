import jwt_decode from "jwt-decode";
import { updateLoggedUserProfile } from "@redux/reducers/user/user.reducer";

import { getAPI } from "./fetchData";
import { Utils } from "./utils.service";

export const newestAccessToken = async (dispatch) => {
  //make sure logged success before goto here, (accessTk and profile is exist) 
  const existAccessToken = sessionStorage.getItem("accessToken");

  if (isAccessTokenValid(existAccessToken)) {
    return existAccessToken;
  } else {
    const res = await getAPI(`/refresh_token`);
    dispatch(updateLoggedUserProfile(res.data.user));
    sessionStorage.setItem("accessToken", res.data.token);
  }
};

export const isAccessTokenExist = (tk) => {
  return tk;
};

export const isAccessTokenValid = (tk) => {
  const access_tokenDecode = jwt_decode(tk);
  return access_tokenDecode.exp >= Date.now() / 1000;
};
