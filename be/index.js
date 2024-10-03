require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const registerRoutes = require("./routes/register");
const loginRoutes = require("./routes/login");
const businessUserProfileRoutes = require("./routes/businessUserProfile");
const businessUserProfileBookingRoutes = require("./routes/businessUserProfileBooking");
const regularUserProfileRoutes = require("./routes/regularUserProfile");
const categoriesRouter = require("./routes/categories");
const eventsRouter = require("./routes/bookings");
const mealsRouter = require("./routes/meals");
const paypalRoutes = require("./routes/paypalRoutes");
const notificationsRoutes = require("./routes/notifications");
const financialRoutes = require("./routes/financials");

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static('public'));
// Route setup
app.use("/api/register", registerRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/profile/business", businessUserProfileRoutes);
app.use("/api/profile/business/bookings", businessUserProfileBookingRoutes);
app.use("/api/profile/regular", regularUserProfileRoutes);
app.use("/api/categories", categoriesRouter);
app.use("/api/bookings", eventsRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/paypal", paypalRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/financial", financialRoutes);
  
const PORT = process.env.PORT || 8801;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
