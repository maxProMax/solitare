import { headers } from "next/headers";

export const getIP = async () => {
  const _h = await headers();

  const ips = _h.get("x-real-ip") || _h.get("x-forwarded-for");
  const [, ip] = ips?.split(",") || [];

  return ip;
};

export const getUserAgent = async () => {
  const _h = await headers();

  const userAgent = _h.get("user-agent");
  return userAgent;
};
