import { useNavigate } from "react-router-dom";
import loginBg from "../../assets/login_bg.png";
import logo from "../../assets/logo.png";
import userIcon from "../../assets/user-icon.svg";
import apiService from "../../apiService.js";
import boxes from "../../assets/login_box_image.png";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const forgetPassword = async (e) => {
    e.preventDefault();
    const userId = e.target.username.value;

    if (!userId.trim()) {
      alert("Please enter your user ID");
      return;
    }

    try {
      // Call your API to handle the forgot password functionality
      const response = await apiService.post(
        "/notifications/request",
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.statusCode === 200) {
        alert("Password reset link sent to your email");
        navigate("/login");
      } else {
        alert("Failed to send password reset link: " + response.data.message);
      }
    } catch (error) {
      console.error("Failed to send password reset link:", error);
      alert("Failed to send password reset link: " + error.message);
    }
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

      <div className="flex flex-col items-end justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 lg:mr-28 z-10 relative">
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-2xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-1 space-y-1 md:space-y-1 sm:p-8 mt-10 justify-center items-center min-w-[350px] min-h-[500px] md:w-[450px] flex flex-col relative">
            <img src={logo} alt="" className="self-center -mt-40" />
            <h1 className="text-xl pt-8 font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
              Forgot Password
            </h1>
            <span className="text-sm py-1.5">Submit your user Id</span>
            <form
              className="space-y-4 md:space-y-6 flex flex-col py-4"
              onSubmit={(e) => forgetPassword(e)}
            >
              <div className="flex flex-col">
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-200 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 md:w-[400px] text-center py-4"
                    placeholder="Enter User Id"
                    required
                  />
                  <img
                    src={userIcon}
                    alt="user icon"
                    className="absolute left-3 top-4 h-6 w-6"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 md:w-[400px] py-4"
              >
                Request password
              </button>
            </form>
            <span
              className="text-blue-500 text-sm absolute bottom-10 underline cursor-pointer hover:text-blue-700"
              onClick={() => navigate("/login")}
            >
              Remeber password ? Login
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
export default ForgotPassword;