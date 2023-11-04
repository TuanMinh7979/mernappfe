import React from "react";
import CountDown from "@components/countdown/CountDown";
import { getRefreshTokenExp, getAccessTokenExp } from "@services/utils/tokenUtils";

const LoginInfo = () => {

    // const rftk = Cookies.get("refreshtoken");
    const rfToken = localStorage.getItem("rfToken");
    const accessToken = sessionStorage.getItem("accessToken");

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
            {rfToken ? (
                <CountDown
                    title={"Refresh token time expire in"}
                    exp={getRefreshTokenExp(rfToken)}
                ></CountDown>
            ) : (
                <p style={{ textAlign: "center" }}>Not exist Refresh Token </p>
            )}
        </>
    );
};

export default LoginInfo;
