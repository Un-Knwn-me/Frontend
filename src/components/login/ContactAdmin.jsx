import React from "react";
import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login_bg.png";
import logo from "../../assets/logo.png";

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
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 lg:mr-28 z-10 relative">
                <div className="w-full bg-white rounded-lg border border-gray-200 shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-1 space-y-1 md:space-y-1 sm:p-8 mt-10 justify-center items-center min-w-[350px] min-h-[500px] md:w-[450px] flex flex-col relative">
                        <img src={logo} alt="" className="self-center -mt-48" />
                        <h1 className="text-xl pt-2 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Contact Admin
                        </h1>
                        <div className="flex items-center justify-center pt-[12vh]">
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
        </section>
    );
};

export default ContactAdmin;
