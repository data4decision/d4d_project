import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Users,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  BarChart3Icon,
   TrendingUp,
} from "lucide-react";
import logoImg from "../assets/logo.png";
import { auth } from "../firebase/firebase";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  user,
  collapsed,
  setCollapsed,
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", icon: Home, to: "/admin/dashboard" },
    { label: "Compare", icon: BarChart2, to: "/admin/compare" },
    { label: "Global Indicator", icon: BarChart2, to: "/admin/global-indicator" },
    { label: "Advanced Comparison", icon: BarChart3Icon, to: "/admin/advanced-comparison" },
    { label: "KPI Trends", icon: TrendingUp, to: "/admin/kpi-trends" },

    { label: "Reports", icon: BarChart2, to: "/admin/reports" },
    { label: "Users", icon: Users, to: "/admin/users" },
    { label: "Settings", icon: Settings, to: "/admin/settings" },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 text-sm font-medium rounded transition-all ${
      isActive
        ? "bg-[#0B0B5C] text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <aside
      className={`fixed z-40 top-0 left-0 h-full ${
        collapsed ? "w-20" : "w-64"
      } bg-white shadow-md transform transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <img src={logoImg} alt="Logo" className="w-13 h-8 mr-2" />
          {!collapsed && (
            <span className="text-sm font-bold text-[#0B0B5C] whitespace-nowrap">
              Data4Decision Intl
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
        </button>
      </div>

      <nav className="mt-4 flex flex-col gap-1 px-2">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink key={label} to={to} className={linkClass}>
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full px-2 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
