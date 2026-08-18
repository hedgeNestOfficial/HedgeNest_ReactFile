// import { useEffect } from "react";

// import { useNavigate } from "react-router-dom";

// import { useDispatch } from "react-redux";

// import toast from "react-hot-toast";

// import { login } from "../../Store/UserSlice";

// const GoogleSuccess = () => {
//   const navigate = useNavigate();

//   const dispatch = useDispatch();

//   useEffect(() => {
//     try {
//       const params = new URLSearchParams(window.location.search);

//       const token = params.get("token");

//       const user = JSON.parse(params.get("user"));

//       if (!token) {
//         toast.error("Google authentication failed");

//         return navigate("/login");
//       }

//       localStorage.setItem("authToken", token);

//       localStorage.setItem("user", JSON.stringify(user));

//       dispatch(
//         login({
//           token,
//           user,
//         }),
//       );

//       toast.success("Authentication successful");

//       if (user?.hasCompletedKyc) {
//         navigate("/dashboard");
//       } else {
//         navigate("/kycauth");
//       }
//     } catch (error) {
//       console.log(error);

//       toast.error("Authentication failed");

//       navigate("/login");
//     }
//   }, []);

//   return <div className="google-loading-screen">Authenticating...</div>;
// };

// export default GoogleSuccess;

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../Store/UserSlice";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      toast.error("Authentication failed");
      navigate("/login");
      return;
    }

    localStorage.setItem("authToken", token);

    dispatch(
      login({
        token,
      }),
    );

    toast.success("Login successful");

    navigate("/dashboard");
  }, []);

  return null;
};

export default GoogleSuccess;
