import { Bell, Menu } from "lucide-react"; // ✅ Removed Sun and Moon icons since dark mode is gone
import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function Navbar({ onMenuClick, user, sidebarOpen, collapsed }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef();

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-6 fixed top-0 right-0 z-20 w-full transition-all duration-300 ${
        sidebarOpen
          ? collapsed
            ? "md:left-20"
            : "md:left-64"
          : "md:left-0"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Show menu icon only on mobile */}
        <button
          onClick={onMenuClick}
          className="text-gray-600 focus:outline-none md:hidden" // ✅ Removed dark:text-gray-300
        >
          <Menu size={24} />
        </button>

        {/* ✅ Removed dark:text-white */}
        <h1 className="hidden md:block text-xl font-semibold text-[#0B0B5C] whitespace-nowrap">
          Admin Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* ✅ Removed dark mode toggle button completely */}

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleNotifications}
            className="relative text-gray-600 hover:text-black" // ✅ Removed dark styles
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-md z-50">
              {/* ✅ Removed dark:bg-gray-700 and dark:border-gray-600 */}
              <div className="p-2 text-sm text-gray-800 font-medium border-b border-gray-200">
                Notifications
              </div>
              <ul className="text-sm max-h-60 overflow-y-auto">
                {notifications.length === 0 && (
                  <li className="px-4 py-2 text-gray-400">No new notifications</li>
                )}
                {notifications.map((notif) => (
                  <li
                    key={notif.id}
                    className="px-4 py-2 hover:bg-gray-100" // ✅ Removed dark:hover:bg-gray-800
                  >
                    {notif.message}
                  </li>
                ))}
              </ul>
              <div className="px-4 py-2 text-xs text-right text-blue-600 cursor-pointer hover:underline">
                View All
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=0B0B5C&color=fff`}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border border-gray-300" // ✅ Removed dark:border-gray-700
          />
          <span className="hidden md:block text-sm text-gray-800 font-medium">
            {user?.name || "Admin"}
          </span>
        </div>
      </div>
    </header>
  );
}
