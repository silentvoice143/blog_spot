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

export const getTimeAgo = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  if (months < 12) return `${months}mo`;

  return `${Math.floor(months / 12)}y`;
};
