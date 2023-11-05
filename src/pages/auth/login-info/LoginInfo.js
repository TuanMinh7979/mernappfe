import React from "react";
import CountDown from "@components/countdown/CountDown";
import { checkRfExp, getAccessTokenExp } from "@services/utils/tokenUtils";
import { useSelector } from "react-redux";
const LoginInfo = () => {

    // can not get Cookies by js code, because httponly in server 
    // const rftk = Cookies.get("refreshtoken");

    const accessToken = sessionStorage.getItem("accessToken");
    const { profile } = useSelector((state) => state.user);
    return (
        <>
            {accessToken ? (
                <CountDown
                    title={"Access Token Time expire in"}
                    exp={getAccessTokenExp(accessToken)}
                ></CountDown>
            ) : (
                <p style={{ textAlign: "center" }}>Not exist Access Token </p>
            )}
            {profile.rfTokenExp ? (
                <CountDown
                    title={"Refresh token time expire in"}
                    exp={checkRfExp(profile.rfTokenExp)}
                ></CountDown>
            ) : (
                <p style={{ textAlign: "center" }}>Not exist Refresh Token </p>
            )}
        </>
    );
};

export default LoginInfo;
