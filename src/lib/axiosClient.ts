import { HOST } from "@/lib/consts";
import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
  baseURL: `${HOST}`,
});

axiosClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  // @ts-expect-error: Необходимость из-за API
  if (session?.user?.accessToken) {
    // @ts-expect-error: Необходимость из-за API
    config.headers["x-auth"] = session.user.accessToken;
  }
  return config;
});

export default axiosClient;
