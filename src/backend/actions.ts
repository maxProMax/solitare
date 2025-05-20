"use server";

import { getIP, getUserAgent } from "./utils";

export const logAction = async () => {
  const ip = await getIP();
  const userAgent = await getUserAgent();
  console.log("action", { ip, userAgent });
};
