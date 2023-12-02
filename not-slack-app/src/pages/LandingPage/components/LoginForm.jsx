import React from "react";
import "../assets/SignInForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import SlackApi from "../../../utils/SlackApi";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObject = new FormData(e.currentTarget);
      const body = Object.fromEntries(formDataObject);
      const res = await SlackApi.post("auth/sign_in", body);

      SlackApi.defaults.headers["uid"] = res.headers["uid"];
      SlackApi.defaults.headers["access-token"] = res.headers["access-token"];
      SlackApi.defaults.headers["client"] = res.headers["client"];
      SlackApi.defaults.headers["expiry"] = res.headers["expiry"];

      localStorage.setItem("uid", res.headers["uid"]);
      localStorage.setItem("access-token", res.headers["access-token"]);
      localStorage.setItem("client", res.headers["client"]);
      localStorage.setItem("expiry", res.headers["expiry"]);

      setIsAuthenticated(true);
    } catch (error) {
      toast.error("Make sure email and password correct!", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error("Registration failed:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login Success", {
        position: toast.POSITION.TOP_CENTER,
      });

      const timeout = setTimeout(() => {
        navigate("/messages", { replace: true });
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="login-container"
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url('./src/Pages/LandingPage/assets/login-form.gif')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}
        data-testid="login-form">
          <div className="inputBox">
            <label for="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="type your email"
              required
              value={formData.email}
              onChange={handleInputChange}
              data-testid="email-input"
            />
          </div>
          <div className="inputBox">
            <label for="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="type your password"
              required
              value={formData.password}
              onChange={handleInputChange}
              data-testid="password-input"
            />
          </div>
          <div>
            <button type="submit" name="" style={{ float: "left" }} data-testid="submit-button">
              Submit
            </button>
            <a className="button" href="register" style={{ float: "left" }}>
              Register
            </a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
