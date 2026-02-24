import './index.css'

const TransactionsList = (props) => {
    const {transactionDetails} = props
    const {amount, category, description, date} = transactionDetails

    return (
        <li className="transaction-item">
            <div className="transaction-amount">₹{amount}</div>
            <div className="transaction-category">
                <span className="category-badge">{category}</span>
            </div>
            <div className="transaction-description">{description}</div>
            <div className="transaction-date">{date.split("T")[0]}</div>
        </li>
    )
}
export default TransactionsList