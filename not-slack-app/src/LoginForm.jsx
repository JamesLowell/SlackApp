import React from "react";
import "./SignInForm.css";
export default function LoginForm() {
  return (
    <div style={{ height: "100vh", width: "100vw"}}>
      <div className="box">
        <h2>Login</h2>
        <form>
          <div className="inputBox">
            <label for="email">Email</label>
            <input
              type="email"
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
          <div>
            <button type="submit" name="" style={{ float: "left" }}>
              Submit
            </button>
            <a className="button" href="register" style={{ float: "left" }}>
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
