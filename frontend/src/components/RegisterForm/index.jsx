import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
import "./index.css";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const readUsername = (event) => {
    setUsername(event.target.value);
  };

  const readEmail = (event) => {
    setEmail(event.target.value);
  };

  const readPassword = (event) => {
    setPassword(event.target.value);
  };

  const readconfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const showOrHidePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmitForm = async (event) => {
    event.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("Please Fill All the Fields");
    } else if (password !== confirmPassword) {
      alert("Password and Confirm Password didn't match, Try again");
    } else {
      setIsLoading((prev) => !prev);
      const userDetails = { username, email, password };
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/auth/register`;
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
        Cookies.set("jwt_token", data.token, { expires: 1 });
        navigate("/", { replace: true });
        setIsLoading((prev) => !prev);
      } else {
        alert(data.message);
        setIsLoading((prev) => !prev);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join Finance Tracker today</p>
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
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              className="form-input"
              onChange={readEmail}
              value={email}
              id="email"
              type="email"
              placeholder="Enter your Email"
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
          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="pass-input-container">
              <input
                className="pass-input"
                onChange={readconfirmPassword}
                value={confirmPassword}
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password Agian"
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
              {isLoading ? (
          <div className="spinner-class">
            <TailSpin
              height="20"
              width="20"
              color="#ffffff"
              ariaLabel="tail-spin-loading"
            />
          </div>
        ) : "Register"}
            </button>
          </div>
          <Link className="auth-link" to="/login">
            <p>
              Already Registered? <span>Login here</span>
            </p>
          </Link>
        </form>
      </div>
    </div>
  );
};
export default RegisterForm;
