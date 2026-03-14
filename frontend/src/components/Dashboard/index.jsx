import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(0);

  const filteredTransactionsList = useMemo(() => {
    return transactionsList.filter((eachTransaction) => {
      const categoryMatch =
        selectedCategory === "All" ||
        eachTransaction.category === selectedCategory;
      // const dateMatch =
      //   selectedDate === "" ||
      //   eachTransaction.date?.split("T")[0] === selectedDate;
      const transactionDate = new Date(eachTransaction.date);
      const fromMatch =
        fromDate === "" || transactionDate >= new Date(fromDate);
      const toMatch = toDate === "" || transactionDate <= new Date(toDate);

      return categoryMatch && fromMatch && toMatch;
    });
  }, [transactionsList, selectedCategory, fromDate, toDate]);

  const monthlyTotal = useMemo(() => {
    // const currentMonth = new Date().getMonth();
    // const currentYear = new Date().getFullYear();

    return transactionsList.reduce((total, eachTransaction) => {
      const transactionDate = new Date(eachTransaction.date);

      if (
        transactionDate.getMonth() === selectedMonth &&
        transactionDate.getFullYear() === selectedYear
      ) {
        return total + Number(eachTransaction.amount);
      }
      return total;
    }, 0);
  }, [transactionsList, selectedMonth, selectedYear]);

  const todayTotal = useMemo(() => {
    const transactionDate = new Date().toISOString().split("T")[0];
    return transactionsList.reduce((total, eachTransaction) => {
      if (eachTransaction.date?.split("T")[0] === transactionDate) {
        return total + eachTransaction.amount;
      }
      return total;
    }, 0);
  }, [transactionsList]);

  const remainingBudget = monthlyIncome - monthlyTotal;

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
        setIsLoading(false);
      } else {
        alert("Failed to Fetch Transactions");
        setIsLoading(false);
      }
    };
    getTransactions();
  }, [pageRefresh]);

  useEffect(() => {
    const fetchProfile = async () => {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/profile`;
      const jwtToken = Cookies.get("jwt_token");
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMonthlyIncome(data.monthlyIncome ?? 0);
      }
    };
    fetchProfile();
  }, []);

  const selectCategoryFilter = (event) => {
    setSelectedCategory(event.target.value);
  };

  const selectFromDate = (event) => {
    setFromDate(event.target.value);
  };

  const selectToDate = (event) => {
    setToDate(event.target.value);
  };

  const setMonthYear = (event) => {
    // console.log(event.target.value)
    setSelectedYear(Number(event.target.value.split("-")[0]));
    setSelectedMonth(Number(event.target.value.split("-")[1] - 1));
  };

  // console.log(selectedMonth, selectedYear)

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-summary">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="summary-cards">
            <div className="summary-card">
              <p className="summary-label">Monthly Total</p>
              <input
                className="month-input"
                type="month"
                value={`${selectedYear}-${String(selectedMonth + 1).padStart(2, "00")}`}
                onChange={setMonthYear}
              />
              <h4 className="summary-value">₹{monthlyTotal}</h4>
            </div>
            <div className="summary-card">
              <p className="summary-label">Today's Spends</p>
              <h5 className="summary-value">₹{todayTotal}</h5>
            </div>
            <div className="summary-card summary-card--income">
              <p className="summary-label">Monthly Income</p>
              <h4 className="summary-value">₹{monthlyIncome}</h4>
            </div>
            <div className="summary-card summary-card--remaining">
              <p className="summary-label">Remaining Budget</p>
              <h4 className={`summary-value ${remainingBudget < 0 ? "summary-value--negative" : ""}`}>
                ₹{remainingBudget}
              </h4>
              {remainingBudget < 0 && (
                <p className="budget-warning">⚠ Budget exceeded by ₹{Math.abs(remainingBudget)}</p>
              )}
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
                    <div>
                      <label className="form-label" htmlFor="fromdate">
                        From Date
                      </label>
                      <input
                        className="form-input"
                        value={fromDate}
                        onChange={selectFromDate}
                        type="date"
                        id="fromdate"
                      />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="todate">
                        To Date
                      </label>
                      <input
                        className="form-input"
                        value={toDate}
                        onChange={selectToDate}
                        type="date"
                        id="todate"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="spinner-class">
              <TailSpin
                height="20"
                width="20"
                color="#f40808"
                ariaLabel="tail-spin-loading"
              />
            </div>
          ) : filteredTransactionsList.length !== 0 ? (
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

        {isLoading ? (
          <div className="spinner-class">
            <TailSpin
              height="20"
              width="20"
              color="#f40808"
              ariaLabel="tail-spin-loading"
            />
          </div>
        ) : (
          <Charts transactionsList={filteredTransactionsList} />
        )}
      </div>
    </div>
  );
};
export default Dashboard;
