import { logoutUser, getUser } from "@/api/user.api";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/components/Notifications/NotificationContext";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await getUser();
        setIsLoggedIn(true); 
      } catch (error) {
        setIsLoggedIn(false); 
      } finally {
        setIsLoading(false); 
      }
    };
    checkAuthStatus();
  }, []); 

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false); 
      addNotification({
        id: Date.now().toString(),
        type: "success",
        message: "Logout Successful",
      });
      navigate("/login"); 
    } catch (error) {
      console.error("Logout failed", error);
      addNotification({
        id: Date.now().toString(),
        type: "error",
        message: "Logout failed. Please try again.",
      });
    }
  };

  const handleLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="fixed inset-x-0 top-0 z-20 mx-auto w-full max-w-screen-md border border-gray-100 bg-white/80 py-3 shadow-lg backdrop-blur-lg md:top-6 md:rounded-full lg:max-w-screen-lg">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0">
            <a aria-current="page" className="flex items-center" href="/">
              <img className="h-7 w-auto" src="/title.png" alt="Logo" />
            </a>
          </div>
          <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
            <a aria-current="page" className="inline-block rounded-lg px-2 py-1 text-lg font-bold text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900" href="#">
              MockMate
            </a>
          </div>
          <div className="flex items-center justify-end gap-3">
            {!isLoading && (
              isLoggedIn ? (
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150"
                  onClick={handleLogIn}
                >
                  Login
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;