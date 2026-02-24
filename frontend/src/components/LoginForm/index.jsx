import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import "./index.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const readUsername = (event) => {
    setUsername(event.target.value);
  };

  const readPassword = (event) => {
    setPassword(event.target.value);
  };

  const submitSuccess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, { expires: 1 });
    navigate("/", { replace: true });
  };

  const submitFailure = (error) => {
    alert(error);
  };

  const showOrHidePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      alert("Please Enter Username and Password");
    } else {
      const userDetails = { username, password };
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/login`;
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      };
      const response = await fetch(apiUrl, options);
      const data = await response.json();
      if (response.ok === true) {
        submitSuccess(data.token);
      } else {
        submitFailure(data.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your Finance Tracker</p>
        </div>
        <form className="auth-form" onSubmit={onSubmitForm}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              className="form-input"
              onChange={readUsername}
              value={username}
              id="username"
              type="text"
              placeholder="Enter your Username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              className="form-input"
              onChange={readPassword}
              value={password}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
            />
          </div>
          <div className="form-group">
            <button
              onClick={showOrHidePassword}
              className="btn-primary"
              type="button"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="form-group">
            <button className="btn-primary" type="submit">
              Login
            </button>
          </div>
        </form>
        <Link className="auth-link" to="/register">
          <p>
            New User? <span>Register Here</span>
          </p>
        </Link>
      </div>
    </div>
  );
};
export default LoginForm;
