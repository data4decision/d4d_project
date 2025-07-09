// pages/client/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, provider } from "../firebase/firebase";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/client/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/client/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-[#0b0b5c]">Client Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {resetEmailSent && <p className="text-green-500 mb-4">Password reset link sent to email.</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-4" required />
        <button type="submit" className="w-full bg-[#0b0b5c] text-white py-2 px-4 rounded hover:bg-[#f45b20]">Login</button>
        <button type="button" onClick={handleGoogleSignIn} className="w-full mt-4 flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-100">
          <FcGoogle className="mr-2 text-xl" /> Sign in with Google
        </button>
        <div className="text-sm text-center mt-4">
          <button type="button" onClick={handleResetPassword} className="text-blue-600 underline">Forgot Password?</button>
        </div>
        <p className="mt-4 text-sm text-center">
          Don’t have an account? <Link to="/client/signup" className="text-[#0b0b5c] font-semibold">Sign Up</Link>
        </p>
      </form>
    </motion.div>
  );
}
