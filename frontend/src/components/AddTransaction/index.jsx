import { useState } from "react";
import Cookies from "js-cookie";
import './index.css'

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Other",
];

const AddTransaction = (props) => {
  const { transactionsRefresh } = props;
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const readAmount = (event) => {
    setAmount(event.target.value);
  };

  const readCategory = (event) => {
    setCategory(event.target.value);
  };

  const readDescription = (event) => {
    setDescription(event.target.value);
  };

  const readDate = (event) => {
    setDate(event.target.value);
  };

  const addTransactionData = async (event) => {
    event.preventDefault();

    if (!amount || !date || !description) {
      alert("Please fill all fields");
      return;
    }

    const jwtToken = Cookies.get("jwt_token");
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/transactions`;
    const transaction = {
      amount: Number(amount),
      category,
      description,
      date,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(transaction),
    };

    const response = await fetch(apiUrl, options);

    if (response.ok === true) {
      setAmount("");
      setCategory(categories[0]);
      setDescription("");
      setDate("");

      transactionsRefresh();
    } else {
      alert("Failed to add Transaction");
    }
  };

  return (
    <div className="add-transaction-card">
      <h1 className="add-transaction-title">Add Transaction</h1>
      <form className="add-transaction-form" onSubmit={addTransactionData}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount</label>
            <input
              className="form-input"
              id="amount"
              onChange={readAmount}
              type="number"
              placeholder="Enter Amount"
              value={amount}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select className="form-select" id="category" value={category} onChange={readCategory}>
              {categories.map((each) => (
                <option key={each} value={each}>
                  {each}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <input
              className="form-input"
              id="description"
              onChange={readDescription}
              type="text"
              placeholder="Enter Description"
              value={description}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input
              className="form-input"
              id="date"
              onChange={readDate}
              type="date"
              placeholder="Enter Date"
              value={date}
            />
          </div>
        </div>
        <div className="form-group">
          <button className="btn-primary btn-add" type="submit">Add Transaction</button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
