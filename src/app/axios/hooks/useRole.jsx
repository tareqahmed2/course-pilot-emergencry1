import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useAxiosPublic from "./useAxiosPublic";

const useRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      axiosPublic
        .get(`/users/role/${user?.email}`)
        .then((res) => {
          setRole(res.data?.role);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [user, axiosPublic]);

  return { role, loading };
};

export default useRole;
