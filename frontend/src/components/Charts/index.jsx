import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  LineChart,
  XAxis,
  YAxis,
  Line,
} from "recharts";
import "./index.css";

const Charts = (props) => {
  const { transactionsList } = props;

  const COLORS = [
    "#4f46e5",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  const categoryTotals = {};

  transactionsList.forEach((eachTransaction) => {
    if (categoryTotals[eachTransaction.category]) {
      categoryTotals[eachTransaction.category] += eachTransaction.amount;
    } else {
      categoryTotals[eachTransaction.category] = eachTransaction.amount;
    }
  });

  const pieChartData = Object.keys(categoryTotals).map((eachCategory) => ({
    name: eachCategory,
    value: categoryTotals[eachCategory],
  }));

  const lineChartData = transactionsList.map((eachTransaction) => ({
    date: eachTransaction.date?.split("T")[0],
    amount: eachTransaction.amount,
  }));

  return (
    <div className="charts-section">
      <h2 className="charts-title">Spending Analytics</h2>
      <div className="charts-grid">
        <div className="chart-card">
          <p className="chart-label">Category Wise Spending</p>
          {transactionsList.length !== 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            <div className="no-data-container">
              <h5>No Data Found on selected Filter</h5>
            </div>
          )}
        </div>
        <div className="chart-card">
          <p className="chart-label">Spending Over Time</p>
          {transactionsList.length !== 0 ? (
            <LineChart width={400} height={300} data={lineChartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          ) : (
            <div className="no-data-container">
              <h5>No Data Found on selected Filter</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
