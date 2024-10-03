import { useState } from "react";
import { API_URL } from "../constans";

const DownloadLogButton = ({ type, userId }) => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true); // Set loading state
      let requestBody = { userId, year };

      if (type === "month") {
        requestBody.month = month;
        if (!month || !year) {
          alert("Please enter both the month and year.");
          setLoading(false);
          return;
        }
      } else if (!year) {
        alert("Please enter the year.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/financial/logs/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to download ${type} log, status: ${response.status}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${type}-log-${
        type === "month" ? `${month}-${year}` : year
      }.pdf`; // PDF extension for log download
      a.click();
      window.URL.revokeObjectURL(url);

      // Reset form and close it after successful download
      setMonth("");
      setYear("");
      setShowForm(false);
      setLoading(false);
    } catch (error) {
      console.error("Error downloading log:", error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} disabled={loading}>
        {loading
          ? "Downloading..."
          : type === "year"
          ? "Download Year Log"
          : "Download Month Log"}
      </button>

      {showForm && (
        <div style={{ marginTop: "10px" }}>
          {type === "month" && (
            <>
              <label>
                Month:
                <input
                  type='number'
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  min='1'
                  max='12'
                />
              </label>
            </>
          )}

          <label>
            Year:
            <input
              type='number'
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min='2000'
            />
          </label>

          <button onClick={handleDownload} disabled={loading}>
            {loading
              ? "Processing..."
              : `Fetch ${type === "year" ? "Year" : "Month"} Log`}
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadLogButton;
