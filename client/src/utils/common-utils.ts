import { publicIp, publicIpv4, publicIpv6 } from "public-ip";
export const getAccessToken = () => {
  // console.log("getting token");
  // console.log(sessionStorage.getItem("accessToken"));
  return sessionStorage.getItem("accessToken");
};

export const getPublicIP = async () => {
  const ip = await publicIp();
  console.log("Public IP Address:", ip);
  return ip;
};
