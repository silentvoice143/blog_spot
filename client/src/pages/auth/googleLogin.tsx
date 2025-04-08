import { DataContext } from "@/context/Dataprovider";
import { useLoader } from "@/context/LoaderProvider";
import { googleLoginApi, googleLoginApi1 } from "@/services/apiService";
import { getPublicIP } from "@/utils/common-utils";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

const GoogleLoginWrapper = ({ setAuthentication }) => {
  return (
    <GoogleOAuthProvider
      clientId={
        "785840914350-b04chjrqoajire3vpb23eadcj2mtv4ud.apps.googleusercontent.com"
      }
    >
      <GoogleLogin setAuthentication={setAuthentication} />
    </GoogleOAuthProvider>
  );
};
function GoogleLogin({ setAuthentication }) {
  const { setAccount } = useContext(DataContext);
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const responseGoogle = async (authResult) => {
    try {
      setLoading(true);
      if (authResult["code"]) {
        console.log("Google Auth Response", authResult);
        const ip = await getPublicIP();
        const response = await googleLoginApi1(ip, authResult.code);
        if (response.status === 200) {
          const data = response.data;
          sessionStorage.setItem("accessToken", data.user.token);
          sessionStorage.setItem("refreshToken", data.user.refreshToken);
          setAccount({
            email: data.user.email,
            token: data.user.token,
            name: data.user.name,
            id: data.user._id,
          });
          setAuthentication(true);
          navigate("/");
        } else {
          console.log("Something went wrong. Please try again later");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <button
      onClick={googleLogin}
      className="text-sm text-gray-700 cursor-pointer"
    >
      <img className="w-5 h-5" src="\google.png" alt="" />
    </button>
  );
}

export default GoogleLoginWrapper;
