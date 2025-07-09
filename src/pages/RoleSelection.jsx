import { Link } from "react-router-dom";

export default function RoleSelection() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold text-[#0b0b5c] mb-8">Choose Your Access</h1>
      <div className="space-x-4">
        <Link to="/client">
          <button className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">Client</button>
        </Link>
        <Link to="/admin">
          <button className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700">Admin</button>
        </Link>
      </div>
    </div>
  );
}
