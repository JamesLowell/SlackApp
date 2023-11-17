import React from "react";
import "./SignInForm.css";

export default function RegisterForm() {
  return (
    <div style={{ 
        height: "100vh", 
        width: "100vw",
        backgroundImage: `url('')`,
        backgroundSize: 'cover', // Ensures the background image covers the entire div
        backgroundPosition: 'center',
        }}>
      <div className="box">
        <h2>Register</h2>
        <form>
          <div className="inputBox">
            <label for="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="type your email"
              required
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
            />
          </div>
          <div className="inputBox">
            <label for="password_confirmation">Confirm Password</label>
            <input
              type="password_confirmation"
              name="password_confirmation"
              id="password_confirmation"
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
