import axios from "axios";
const baseURl = "https://staging-afcs-ws.alleasy.com.ph/api";
export const sendOTP = (number) => {
  return axios.post(`${baseURl}/site/register/mobile`, { mobile: number });
};

export const inputOtp = (data) => {
  return axios.post(`${baseURl}/site/register/otp/v3`, data);
};
