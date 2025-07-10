import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { paths } from "./config/path";
import api from "./lib/api";

const ProtectedRoute = () => {
  const location = useLocation();

 const getUser = async () => {
  const response = await api.get("/auth/me");

  console.log("✅ [getUser] Response:", response);

  if (response?.success && response?.data) {
    return response.data;
  }

  throw new Error("User not authenticated");
};




 const {
  data: user,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["authenticatedUser"],
  queryFn: getUser,
  retry: false,
  refetchOnWindowFocus: false,
});

if (isLoading) return <div>Loading...</div>;

if (isError || !user) {
  console.error("❌ Auth Error:", error);
  console.log("🚀 ~ ProtectedRoute ~ isError || !user:", isError , !user);
  const redirectTo = paths.auth.login.getHref(location.pathname + location.search);
  return <Navigate to={redirectTo} replace />;
}

  return <Outlet />;
};

export default ProtectedRoute;
