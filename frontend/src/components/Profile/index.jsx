import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import Header from "../Header";
import "./index.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/profile`;
      const jwtToken = Cookies.get("jwt_token");
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      };
      const response = await fetch(apiUrl, options);
      const data = await response.json();
      if (response.ok) {
        setProfile(data);
        setMonthlyIncome(data.monthlyIncome ?? 0);
      } else {
        setMessage({ text: "Failed to load profile.", type: "error" });
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, []);

  const onUpdateIncome = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/profile/income`;
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ monthlyIncome: Number(monthlyIncome) }),
    };
    const response = await fetch(apiUrl, options);
    const data = await response.json();
    if (response.ok) {
      setProfile((prev) => ({ ...prev, monthlyIncome: data.monthlyIncome }));
      setMessage({ text: "Income updated successfully!", type: "success" });
    } else {
      setMessage({ text: data.message || "Failed to update income.", type: "error" });
    }
    setIsSaving(false);
  };

  return (
    <div className="profile-page">
      <Header />
      <div className="profile-container">
        <h1 className="profile-title">My Profile</h1>
        {isLoading ? (
          <div className="spinner-class">
            <TailSpin height="30" width="30" color="#4f46e5" ariaLabel="loading" />
          </div>
        ) : (
          <div className="profile-card">
            <div className="profile-section">
              <h2 className="profile-section-title">Personal Details</h2>
              <div className="profile-field">
                <span className="profile-field-label">Username</span>
                <span className="profile-field-value">{profile?.username}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Email</span>
                <span className="profile-field-value">{profile?.email}</span>
              </div>
            </div>

            <div className="profile-divider" />

            <div className="profile-section">
              <h2 className="profile-section-title">Monthly Income</h2>
              <p className="profile-section-desc">
                Set your monthly income to track your budget on the Dashboard.
              </p>
              <form className="income-form" onSubmit={onUpdateIncome}>
                <div className="form-group">
                  <label className="form-label" htmlFor="monthlyIncome">
                    Monthly Income (₹)
                  </label>
                  <input
                    className="form-input"
                    id="monthlyIncome"
                    type="number"
                    min="0"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    placeholder="Enter your monthly income"
                  />
                </div>
                <button className="btn-primary btn-update" type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Update Income"}
                </button>
              </form>
              {message.text && (
                <p className={`profile-message profile-message--${message.type}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
