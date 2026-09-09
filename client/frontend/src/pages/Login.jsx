import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosCalls/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [err,setErr] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users/login" , form)
      const userData = await axiosInstance.get("/users/me")
      setUser(userData.data.authenticatedUser)
      navigate("/home" , {
        state: {message:"Welcome Back!"}
      });
    } catch (error) {
      setErr(error.response.data.message || "Invalid Credentials")
      console.log(error.response.data.message)
    }

  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-page grid min-h-[650px] lg:grid-cols-2">
      <div className="auth-aside px-6 py-14 sm:px-12 lg:px-[8vw] lg:py-24">
        <p className="eyebrow">Welcome back</p>
        <h1 className="text-5xl leading-[.94] sm:text-7xl">
          Your good taste
          <br />
          <em>missed you.</em>
        </h1>
        <p>Pick up where you left off and keep finding things worth keeping.</p>
      </div>
      <div className="auth-panel mx-auto w-full max-w-md self-center px-6 py-16 sm:px-12">
        <p className="eyebrow">Sign in</p>
        <h2>Welcome back</h2>
        <p className="auth-muted">Enter your details to continue.</p>
        <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-xs font-bold text-[var(--ink)]">
            Email address
            <input
              className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-[var(--coral)]"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>
          <label className="block text-xs font-bold text-[var(--ink)]">
            Password
            <input
              className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-3 text-sm outline-none transition-colors focus:border-[var(--coral)]"
              type="password"
              name="password"
              value={form.password}
              placeholder="Your password"
              onChange={handleChange}
            />
          </label>
          <div className="form-row flex items-center justify-between gap-3 pt-2 text-xs">
            <label className="check-label">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#forgot">Forgot password?</a>
          </div>
          <button
            className="primary-button mt-5 flex w-full items-center justify-center gap-5 py-3"
            type="submit"
          >
            Log in <span>→</span>
          </button>
        </form>
        <p className="auth-switch">
          New to ShopKart? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
