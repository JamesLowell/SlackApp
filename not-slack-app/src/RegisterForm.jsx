import React from "react";
import "./SignInForm.css";
import SlackApi from "./components/SlackApi";

export default function RegisterForm() {
    async function handleSubmit(e) {
        e.preventDefault();
    try{
        const formData = new FormData(e.currentTarget)
        const body = Object.fromEntries(formData)
        const res = await SlackApi.post("/auth/",body)

        SlackApi.defaults.headers["uid"] = res.headers["uid"];
      SlackApi.defaults.headers["access-token"] = res.headers["access-token"];
      SlackApi.defaults.headers["client"] = res.headers["client"];
      SlackApi.defaults.headers["expiry"] = res.headers["expiry"];

        localStorage.setItem("uid", res.headers["uid"])
        localStorage.setItem("access-token", res.headers["access-token"])
        localStorage.setItem("client", res.headers["client"])
        localStorage.setItem("expiry", res.headers["expiry"])

    } catch (error){
        console.error("Registration failed:", error);
    }
    }
  return (
    <div style={{ 
        height: "100vh", 
        width: "100vw",
        backgroundImage: `url('')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        }}>
      <div className="box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="inputBox">
            <label htmlFor="User email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="type your email"
              required
            />
          </div>
          <div className="inputBox">
            <label htmlFor="User password">Password</label>
            <input
            type="User password"
              name="password"
              placeholder="type your password"
              required
            />
          </div>
          <div className="inputBox">
            <label htmlFor="Re-type password">Confirm Password</label>
            <input
            type="Re-type password"
              name="password_confirmation"
              placeholder="confirm your password"
              required
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
    </div>
  );
}
