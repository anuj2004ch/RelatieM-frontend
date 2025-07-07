import { useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";
import useSocketStore from '../store/socketStore.js';
import useAuthUser from '../hooks/useAuthUser';
import { useLocation } from "react-router";

function Layout({children, showSidebar = false}) {
  const { authUser } = useAuthUser();
  const { connect, disconnect } = useSocketStore();
  const location=useLocation();
  const valid=!location.pathname.startsWith("/chat");

  // Initialize socket when user is authenticated
  useEffect(() => {
    if (authUser?._id) {
      connect(authUser._id);
    }

    return () => {
      // Only disconnect if user logs out, not on component unmount
      if (!authUser) {
        disconnect();
      }
    };
  }, [authUser?._id, connect, disconnect,authUser]);

  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Sidebar/>}
        <div className="flex-1 flex flex-col">
          {valid && <Navbar />}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout;


