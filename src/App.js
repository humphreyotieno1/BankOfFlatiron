import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import TransactionTable from './components/TransactionTable';
import AddTransactionForm from './components/AddTransactionForm';
import EditTransactionForm from './components/EditTransaction'; // Corrected import path
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [term, setTerm] = useState('');
  const [sortType, setSortType] = useState(null);
  const [editMode, setEditMode] = useState(null);

  useEffect(() => {
    fetchTransaction();
  }, [transactions]);

  const fetchTransaction = async () => {
    try {
      const response = await fetch("http://localhost:8001/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.log("Error fetching transaction ", error);
    }
  };

  const handleSearch = (searchValue) => {
    setTerm(searchValue);
  };

  const filteredTransactions = transactions.filter((transaction) =>
    transaction.description.toLowerCase().includes(term.toLowerCase())
  );

  const addTransaction = async (newTransaction) => {
    try {
      const response = await fetch("http://localhost:8001/transactions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTransaction)
      });
      if (response.ok) {
        fetchTransaction();
      } else {
        console.log('Error adding transaction ', response.statusText);
      }
    } catch (error) {
      console.error("Error adding transaction ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/transactions/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTransactions(transactions.filter((transaction) => transaction.id !== id));
      } else {
        console.log('Error deleting transaction ', response.statusText);
      }
    } catch (error) {
      console.error("Error deleting transaction ", error);
    }
  };

  const handleEdit = (id) => {
    setEditMode(id);
  };

  const handleUpdate = () => {
    fetchTransaction();
    setEditMode(null);
  };

  return (
    <div className="App">
      <h2>Bank Of FlatIron</h2>
      <SearchBar onSearch={handleSearch} />
      <br />
      <button style={{ margin: 10 }} className='btn btn-primary' onClick={() => handleSort(null)}>Clear Sort</button>
      <button style={{ margin: 10 }} className='btn btn-primary' onClick={() => handleSort('category')}>Sort by Category</button>
      <button style={{ margin: 10 }} className='btn btn-primary' onClick={() => handleSort('description')}>Sort by Description</button>
      <TransactionTable transactions={filteredTransactions} onDelete={handleDelete} onEdit={handleEdit} /> {/* Pass handleEdit function */}
      {editMode && (
        <EditTransactionForm
          transaction={transactions.find(transaction => transaction.id === editMode)}
          onUpdate={handleUpdate}
          onCancel={() => setEditMode(null)} // Pass onCancel function to exit edit mode
        />
      )}
      <AddTransactionForm onAdd={addTransaction} />
    </div>
  );
}

export default App;
