import React, { useState, useEffect } from 'react';
import BusinessNavBar from '../components/BusinessNavBar';
import '../styles/Financial.css';

const Financial = () => {
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    const mockData = [
      { month: 'January', income: 4000 },
      { month: 'February', income: 3000 },
      { month: 'March', income: 5000 },
      { month: 'April', income: 7000 },
      { month: 'May', income: 6000 },
      { month: 'June', income: 8000 },
    ];
    setIncomeData(mockData);
  }, []);

  return (
    <div>
      <div className="financial-container">
        <h1>Financial Page</h1>
        {/* Add your financial page content here */}
      </div>
    </div>
  );
};

export default Financial;
