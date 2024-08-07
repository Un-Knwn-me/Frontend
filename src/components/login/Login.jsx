import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login_bg.png";
import logo from "../../assets/logo.jpg";
import eyeIcon from "../../assets/eye-icon.svg";
import eyeSlashIcon from "../../assets/eye-slash-icon.svg";
import keyIcon from "../../assets/key-icon.svg";
import userIcon from "../../assets/user-icon.svg";
import boxes from "../../assets/login_box_image.png";

import apiService from "../../apiService.js";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const login = async (e) => {
    e.preventDefault();
    try {
    //   // Validate email and password
    // if (!email.trim() || !password.trim()) {
    //   alert("Please enter both email and password");
    //   return;
    // }

    // if (!validateEmail(email)) {
    //   alert("Please enter a valid email address");
    //   return;
    // }
      // Get email and password from the form
      const email = e.target.email.value;
      const password = e.target.password.value;
      // Use the apiService to make the API request
      const response = await apiService.post("/users/signin", {
        userVerify: email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", JSON.stringify(response.data.userId));
        localStorage.setItem("profile", response.data.profile);
        localStorage.setItem("userName", response.data.userName);
        // Navigate to the dashboard
      navigate("/main/dashboard"); 
      }
      
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const validateEmail = (email) => {
  //     // Regular expression for email validation
  //     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     return regex.test(email);
  // }
 
  return (
    <section
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      
      <div>
        <img alt="boxes" src={boxes} className="p-14" />
      </div>
      <div className="flex flex-col items-end justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 lg:mr-28 z-10 relative">
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-1 space-y-1 md:space-y-1 sm:p-8 mt-10 justify-center items-center min-w-[350px] min-h-[500px] md:w-[450px] flex flex-col relative">
            <img src={logo} alt="" className="self-center h-16 -mt-20" />
            <h1 className="text-xl pt-4 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Welcome!
            </h1>
            <form
              className="space-y-4 md:space-y-6 flex flex-col py-10"
              onSubmit={(e) => login(e)}
            >
              <div className="flex flex-col">
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:w-[400px] text-center py-4"
                    placeholder="Enter Email"
                    required
                  />
                  <img
                    src={userIcon}
                    alt="user icon"
                    className="absolute left-3 top-4 h-6 w-6"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:w-[400px] text-center py-4"
                    required
                  />
                  <img
                    src={keyIcon}
                    alt="key icon"
                    className="absolute left-3 top-4 h-6 w-6"
                  />
                  <img
                    src={showPassword ? eyeSlashIcon : eyeIcon}
                    alt="eye icon"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-4 cursor-pointer h-6 w-6"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:w-[400px] py-4"
              >
                Login
              </button>
            </form>
            <span
              className="text-blue-500 text-sm absolute bottom-10 underline cursor-pointer hover:text-blue-700 dark:text-slate-200 dark:hover:text-slate-50"
              onClick={() => navigate("/forgot-password")}
            >
              Forget password ? Contact admin
            </span>
          </div>
        </div>
      </div>
   
      <div className="absolute bottom-0 w-full text-center pb-4 text-white">
        <p>Powered by Quco</p>
      </div>
     
    </section>
  );
};

export default Login;
