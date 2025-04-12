import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://course-pilot-serverr.vercel.app",
});
const useAxiosPublic = () => {
  return axiosPublic;
};
export default useAxiosPublic;
