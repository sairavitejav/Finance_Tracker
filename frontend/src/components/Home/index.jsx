import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Header from "../Header";
import "./index.css";

const Home = () => {
  const jwtToken = Cookies.get("jwt_token");

  let username;

  if (jwtToken) {
    try {
      const decodedJwt = jwtDecode(jwtToken);
      username = decodedJwt.username;
    } catch (error) {
      console.log(error);
      username = "User";
    }
  }

  return (
    <div className="home-container">
      <Header />
      <div className="home-content">
        <div className="hero-content">
          <h1>Hello {username}, Welcome to Expense Tracker</h1>
          <h2>Track Your Expenses Smarter</h2>
          <p>
            Manage your spending, visualize trends, and take control of your
            finances.
          </p>

          <Link to="/dashboard">
            <button className="hero-btn">Go to Dashboard</button>
          </Link>
        </div>
        <div className="features">
          <div className="feature-card">
            <h3>📊 Visual Charts</h3>
            <p>See spending trends clearly.</p>
          </div>

          <div className="feature-card">
            <h3>💰 Expense Tracking</h3>
            <p>Track every transaction easily.</p>
          </div>

          <div className="feature-card">
            <h3>🔐 Secure Access</h3>
            <p>JWT authentication protection.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
