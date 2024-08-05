import React from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login_bg.png";
import logo from "../../assets/logo.jpg";
import boxes from "../../assets/login_box_image.png";


const ContactAdmin = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/");
  };

  return (
    <section
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <div>
        <img alt="boxes" src={boxes} className="p-14 mt-10" />
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 lg:mr-28 z-10 relative">
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-8 space-y-6 md:space-y-6 sm:p-8 mt-10 justify-center items-center min-w-[350px] min-h-[500px] md:w-[450px] flex flex-col relative">
            <img src={logo} alt="logo" className="self-center -mt-48" />
            <h1 className="text-xl pt-2 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Contact Admin
            </h1>
            <div className="flex justify-center items-center mt-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif"
                alt="buffering icon"
                style={{ height: '50px' }} 
              />
            </div>
            <div className="flex items-center justify-center mt-12">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="w-full bg-red-500 hover:bg-red-600 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-md px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:w-[400px] py-4"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 w-full text-center pb-4 text-white">
        <p>Powered by Quco</p>
      </div>
    </section>
  );
};

export default ContactAdmin;