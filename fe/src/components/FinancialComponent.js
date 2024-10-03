import { useState } from "react";
import { API_URL } from "../constans";
import DownloadLogButton from "./DownloadLogButton"; // Default import

const FinancialComponent = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [financialData, setFinancialData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [events, setEvents] = useState([]); // For event data
  const [loading, setLoading] = useState(false); // For showing loading state
  const [error, setError] = useState(null); // For showing error state

  const userId = localStorage.getItem("userId"); // Get userId from localStorage

  const handleFetchFinancialData = async () => {
    console.log("Fetching financial data...", { userId, fromDate, toDate });

    if (!fromDate || !toDate) {
      alert("Please select both 'From' and 'To' dates.");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      alert("The 'To' date must be greater than or equal to the 'From' date.");
      return;
    }

    setLoading(true); // Show loading while fetching data
    setError(null); // Clear previous errors

    try {
      // Fetch reservations (by purchase_date)
      const reservationsResponse = await fetch(
        `${API_URL}/api/financial/reservations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, fromDate, toDate }),
        }
      );

      if (!reservationsResponse.ok) {
        throw new Error(
          `Failed to fetch reservations, status: ${reservationsResponse.status}`
        );
      }

      const reservationsData = await reservationsResponse.json();
      setReservations(reservationsData);

      // Fetch events (by date)
      const eventsResponse = await fetch(`${API_URL}/api/financial/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, fromDate, toDate }),
      });

      if (!eventsResponse.ok) {
        throw new Error(
          `Failed to fetch events, status: ${eventsResponse.status}`
        );
      }

      const eventsData = await eventsResponse.json();
      setEvents(eventsData);

      // Fetch financial summary
      const summaryResponse = await fetch(`${API_URL}/api/financial/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, fromDate, toDate }),
      });

      if (!summaryResponse.ok) {
        throw new Error(
          `Failed to fetch financial summary, status: ${summaryResponse.status}`
        );
      }

      const summaryData = await summaryResponse.json();
      setFinancialData(summaryData);
    } catch (error) {
      console.error("Error during fetching:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='financial-component'>
      <h2>Financial Details</h2>

      {/* Date selection inputs */}
      <label>
        From Date:
        <input
          type='date'
          value={fromDate}
          onChange={(e) => {
            setFromDate(e.target.value);
            setToDate(""); // Reset the To Date when From Date changes to ensure valid selection
          }}
        />
      </label>

      <label>
        To Date:
        <input
          type='date'
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          min={fromDate || null} // Ensures the user can't select a "To" date earlier than the "From" date
        />
      </label>

      <button onClick={handleFetchFinancialData} disabled={loading}>
        {loading ? "Loading..." : "Get Financial Data"}
      </button>

      {/* Error Display */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display Financial Summary Table */}
      {financialData && !loading && (
        <div className='financial-summary'>
          <h3>
            Financial Summary From {fromDate} to {toDate}
          </h3>
          <table>
            <thead>
              <tr>
                <th>Total Price</th>
                <th>Paid</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{financialData.total_price_sum}</td>
                <td>{financialData.paid_sum}</td>
                <td>{financialData.price_remaining_sum}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {/* Display Reservations Table */}
      {reservations.length > 0 && !loading && (
        <div className='reservations'>
          <h3>
            Reservations From {fromDate} to {toDate}
          </h3>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Reservation Date</th>
                <th>Total Price</th>
                <th>Paid</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation, index) => (
                <tr key={index}>
                  <td>{reservation.firstName}</td>
                  <td>{reservation.lastName}</td>
                  <td>{reservation.email}</td>
                  <td>{reservation.phoneNumber}</td>
                  <td>{reservation.purchase_date}</td>
                  <td>{reservation.total_price}</td>
                  <td>{reservation.paid}</td>
                  <td>{reservation.price_remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display Events Table */}
      {events.length > 0 && !loading && (
        <div className='events'>
          <h3>
            Events From {fromDate} to {toDate}
          </h3>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Event Date</th>
                <th>Total Price</th>
                <th>Paid</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td>{event.firstName}</td>
                  <td>{event.lastName}</td>
                  <td>{event.email}</td>
                  <td>{event.phoneNumber}</td>
                  <td>{event.date}</td>
                  <td>{event.total_price}</td>
                  <td>{event.paid}</td>
                  <td>{event.price_remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Download Buttons at the bottom */}
      <div className='log-download-container'>
        <DownloadLogButton type='year' userId={userId} />
        <DownloadLogButton type='month' userId={userId} />
      </div>

      {reservations.length === 0 && !loading && <p>No reservations yet.</p>}
      {events.length === 0 && !loading && <p>No events yet.</p>}
    </div>
  );
};

export default FinancialComponent;
