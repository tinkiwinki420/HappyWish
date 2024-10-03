import moment from "moment"; // Import moment.js for relative time display
import React, { useEffect, useState } from "react";
import "../styles/NotificationDropdown.css";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [isOpen, setIsOpen] = useState(false); // State to track dropdown visibility
  const [unreadCount, setUnreadCount] = useState(0); // State for unread notifications count
  const businessId = localStorage.getItem("userId"); // Get businessId from localStorage

  // Fetch notifications count when component mounts
  useEffect(() => {
    if (businessId) {
      fetch(`/api/notifications/${businessId}`)
        .then((response) => response.json())
        .then((data) => {
          setNotifications(data); // Set notifications state with fetched data
          const unreadNotifications = data.filter((n) => !n.is_read).length;
          setUnreadCount(unreadNotifications); // Update unread notifications count
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }
  }, [businessId]);

  // Fetch notifications when the dropdown is opened
  useEffect(() => {
    if (isOpen && businessId) {
      fetch(`/api/notifications/${businessId}`)
        .then((response) => response.json())
        .then((data) => {
          setNotifications(data); // Set notifications state with fetched data

          // Mark all unread notifications as read
          const unreadNotificationIds = data
            .filter((n) => !n.is_read)
            .map((n) => n.id);

          if (unreadNotificationIds.length > 0) {
            fetch("/api/notifications/mark-as-read", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notificationIds: unreadNotificationIds }),
            });
          }

          // Reset unread count to 0 after opening the dropdown
          setUnreadCount(0);
        })
        .catch((error) => {
          console.error("Error fetching notifications:", error);
        });
    }
  }, [isOpen, businessId]);

  // Toggle the visibility of the notification dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-icon" onClick={toggleDropdown}>
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      </div>

      {isOpen && (
        <div className={`notification-menu ${isOpen ? "open" : ""}`}>
          {notifications.length === 0 ? (
            <div className="no-notifications">No notifications</div>
          ) : (
            <ul>
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className={notification.is_read ? "read" : "unread"}
                >
                  <div>
                    <span>
                      {`${notification.first_name} ${notification.last_name} has booked ${notification.date} at the ${notification.time_slot}`}
                    </span>
                    <span className="notification-time">
                      {moment(notification.created_at).fromNow()}
                      {/* Display time ago */}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
