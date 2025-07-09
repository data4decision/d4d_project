import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore"; // Firestore functions

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user's role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          setError("Unauthorized: You are not an admin.");
        }
      } else {
        setError("User record not found in Firestore.");
      }

    } catch (err) {
      const errorCode = err.code;
      switch (errorCode) {
        case "auth/user-not-found":
          setError("No user found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email format.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f5f5]">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#0b0b5c] text-center">
          Admin Login
        </h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#0b0b5c] text-white py-2 px-4 rounded hover:bg-[#f47b20] transition duration-200"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/admin/signup" className="text-[#0b0b5c] font-semibold hover:text-[#f47b20]">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
