import FinancialComponent from "../components/FinancialComponent"; // Import your financial component
import "../styles/Financial.css";

const Financial = () => {
  return (
    <div id='root'>
      <main>
        <div className='financial-container'>
          {/* Add FinancialComponent here */}
          <FinancialComponent />
        </div>
      </main>
    </div>
  );
};

export default Financial;
