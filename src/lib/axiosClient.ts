import { HOST } from "@/lib/consts";
import axios from "axios";
import { getSession } from "next-auth/react";

const axiosClient = axios.create({
  baseURL: `${HOST}`,
});

axiosClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.accessToken) {
    config.headers["x-auth"] = session.user.accessToken;
  }
  return config;
});

export default axiosClient;
