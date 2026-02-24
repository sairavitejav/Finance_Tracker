import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import TransactionsList from "../TransactionsList";
import AddTransaction from "../AddTransaction";
import Charts from "../Charts";
import Header from "../Header";
import "./index.css";

const filteringCategories = [
  "All",
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Other",
];

const Dashboard = () => {
  const [transactionsList, setTransactionsList] = useState([]);
  const [pageRefresh, setPageRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    filteringCategories[0],
  );
  const [selectedDate, setSelectedDate] = useState("");

  const filteredTransactionsList = useMemo(() => {
    return transactionsList.filter((eachTransaction) => {
      const categoryMatch =
        selectedCategory === "All" ||
        eachTransaction.category === selectedCategory;
      const dateMatch =
        selectedDate === "" ||
        eachTransaction.date?.split("T")[0] === selectedDate;

      return categoryMatch && dateMatch;
    });
  }, [transactionsList, selectedCategory, selectedDate]);

  const monthlyTotal = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactionsList.reduce((total, eachTransaction) => {
      const transactionDate = new Date(eachTransaction.date);

      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        return total + Number(eachTransaction.amount);
      }
      return total;
    }, 0);
  }, [transactionsList]);

  const todayTotal = useMemo(() => {
    const transactionDate = new Date().toISOString().split("T")[0];
    return transactionsList.reduce((total, eachTransaction) => {
      if (eachTransaction.date?.split("T")[0] === transactionDate) {
        return total + eachTransaction.amount;
      }
      return total;
    }, 0);
  }, [transactionsList]);

  const refreshPage = () => {
    setPageRefresh((prev) => !prev);
  };

  useEffect(() => {
    const getTransactions = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/transactions`;
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
      if (response.ok === true) {
        setTransactionsList(data);
      } else {
        alert("Failed to Fetch Transactions");
      }
    };
    getTransactions();
  }, [pageRefresh]);

  const selectCategoryFilter = (event) => {
    setSelectedCategory(event.target.value);
  };

  const selectDateFilter = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-summary">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="summary-cards">
            <div className="summary-card">
              <p className="summary-label">Monthly Total</p>
              <h4 className="summary-value">₹{monthlyTotal}</h4>
            </div>
            <div className="summary-card">
              <p className="summary-label">Today's Spends</p>
              <h5 className="summary-value">₹{todayTotal}</h5>
            </div>
          </div>
        </div>

        <AddTransaction transactionsRefresh={refreshPage} />

        <div className="transactions-section">
          <div>
            <h2 className="section-title">Transactions</h2>
            {transactionsList.length !== 0 && (
              <div className="filters-card">
                <div className="filters-row">
                  <div className="filter-group">
                    <label className="form-label" htmlFor="category">
                      Filter By Category
                    </label>
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={selectCategoryFilter}
                      id="category"
                    >
                      {filteringCategories.map((eachFilter) => (
                        <option key={eachFilter} value={eachFilter}>
                          {eachFilter}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="filter-group">
                    <label className="form-label" htmlFor="date">
                      Filter By Date
                    </label>
                    <input
                      className="form-input"
                      value={selectedDate}
                      onChange={selectDateFilter}
                      type="date"
                      id="date"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {filteredTransactionsList.length !== 0 ? (
            <ul className="transactions-list">
              {filteredTransactionsList.map((eachTransaction) => (
                <TransactionsList
                  transactionDetails={eachTransaction}
                  key={eachTransaction._id}
                />
              ))}
            </ul>
          ) : (
            <div className="no-data-container">
              <h5>No Transactions Found</h5>
              <h6>Add your Transactions data using the above form</h6>
            </div>
          )}
        </div>

        <Charts transactionsList={filteredTransactionsList} />
      </div>
    </div>
  );
};
export default Dashboard;
