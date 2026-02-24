import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const Header = () => {
  const navigate = useNavigate();

  const onLogOut = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="header">
      <div className="header-brand">
        <Link to="/">
          <h1 className="header-title">Finance Tracker</h1>
        </Link>
      </div>
      <div className="header-actions">
        <Link className="header-links" to="/dashboard">Dashboard</Link>
        <button className="logout-btn" onClick={onLogOut}>
          Logout
        </button>
      </div>
    </div>
  );
};
export default Header;
