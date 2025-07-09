import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Removed darkMode state and related logic

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "Admin",
          email: currentUser.email,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    // ✅ Removed dark class from root div
    <div>
      {/* ✅ Removed dark:bg and dark:text classes */}
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 text-gray-900">

        {/* Mobile Backdrop */}
        <div
          className={`fixed inset-0 z-10 bg-white bg-opacity-40 md:hidden transition-opacity duration-300 ${
            sidebarOpen ? "opacity-10" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Navbar
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
            // ✅ Commented out dark mode toggle
            // onToggleDark={() => setDarkMode((prev) => !prev)}
            user={user}
            sidebarOpen={sidebarOpen}
            collapsed={collapsed}
          />
          <main
            className={`flex-1 p-4 overflow-x-hidden mt-16 transition-all duration-300 ${
              sidebarOpen
                ? collapsed
                  ? "md:ml-20"
                  : "md:ml-64"
                : "md:ml-0"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
