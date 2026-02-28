import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
import "./index.css";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading((prev) => !prev);
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
        setIsLoading((prev) => !prev);
      } else {
        submitFailure(data.message);
        setIsLoading((prev) => !prev);
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
        {isLoading && (
          <div className="spinner-class">
            <TailSpin
              height="20"
              width="20"
              color="#f40808"
              ariaLabel="tail-spin-loading"
            />
          </div>
        )}
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
            <div className="pass-input-container">
              <input
                className="pass-input"
                onChange={readPassword}
                value={password}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
              />
              <button
                onClick={showOrHidePassword}
                className="pass-icon"
                type="button"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div className="form-group"></div>
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
