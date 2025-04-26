import { env } from "@/../env";
import _axios from "axios";

export const axios = _axios.create({
    baseURL: env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    headers: {
        "X-API-KEY": env.NEXT_PUBLIC_API_KEY,
    },
});
