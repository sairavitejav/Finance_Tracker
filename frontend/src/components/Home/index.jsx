import { Link } from "react-router-dom";
import Header from "../Header";
import "./index.css";

const Home = () => (
  <div className="home-container">
    <Header />
    <div className="home-content">
      <div className="hero-content">
        <h1>Track Your Expenses Smarter</h1>
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
export default Home;
