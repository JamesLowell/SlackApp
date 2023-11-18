import React, { useState } from "react";
import "./SignInForm.css";
import SlackApi from "./components/SlackApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match!", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }


    try {
      const formDataObject = new FormData(e.currentTarget);
      const body = Object.fromEntries(formDataObject);
      const res = await SlackApi.post("/auth/", body);

      SlackApi.defaults.headers["uid"] = res.headers["uid"];
      SlackApi.defaults.headers["access-token"] = res.headers["access-token"];
      SlackApi.defaults.headers["client"] = res.headers["client"];
      SlackApi.defaults.headers["expiry"] = res.headers["expiry"];

      localStorage.setItem("uid", res.headers["uid"]);
      localStorage.setItem("access-token", res.headers["access-token"]);
      localStorage.setItem("client", res.headers["client"]);
      localStorage.setItem("expiry", res.headers["expiry"]);

      toast.success("Register Submit!", {
        position: toast.POSITION.TOP_CENTER,
      });
      setFormData({
        email: "",
        password: "",
        password_confirmation: "",
      });
    } catch (error) {
      toast.error("Register Failed!", {
        position: toast.POSITION.TOP_CENTER,
      });
      console.error("Registration failed:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url('')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <label>Email</label>
            <input
              name="email"
              placeholder="type your email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="inputBox">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="type your password"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="inputBox">
            <label>Confirm Password</label>
            <input
              name="password_confirmation"
              type="password"
              placeholder="confirm your password"
              required
              value={formData.password_confirmation}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" name="" style={{ float: "left" }}>
            Submit
          </button>
          <a className="button" href="log-in" style={{ float: "left" }}>
            Login
          </a>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
