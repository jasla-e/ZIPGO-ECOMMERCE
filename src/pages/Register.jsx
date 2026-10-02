import { useState } from "react";
import { registerUser } from "../services/authApi";
import {
  useNavigate,
  Link,
} from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

       
    try {
      await registerUser({
        name,
        email,
        password,
      });

      alert("Registered successfully");

      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow w-80"
      >
        <h2 className="text-xl font-bold mb-4">
          Register
        </h2>

        <input
          className="w-full border p-2 mb-2"
          placeholder="Name"
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          className="w-full border p-2 mb-2"
          placeholder="Email"
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          className="w-full border p-2 mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Register
        </button>

        <p className="text-sm mt-3 text-center">
          Already have account?{" "}
          <Link
            className="text-blue-600"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}