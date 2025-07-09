import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { motion } from "framer-motion";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    phone: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // ✅ 2. Save user data in Firestore with admin role
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        uid: user.uid,
        role: "admin",
        createdAt: new Date()
      });

      // ✅ 3. Navigate to Admin Login
      navigate("/admin/login");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen bg-[#f5f5f5]"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#0b0b5c]">
          Admin Sign Up
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          name="surname"
          placeholder="Surname"
          value={formData.surname}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#0b0b5c] text-white py-2 px-4 rounded hover:bg-[#f45b20]"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-[#0b0b5c] font-semibold hover:text-[#f45b20]">
            Login
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
