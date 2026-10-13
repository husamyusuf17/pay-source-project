const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "Pay Source Project API", status: "running" }));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/purchase-requests", require("./routes/purchaseRequestRoutes"));
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/sourcing", require("./routes/sourcingRoutes"));
app.use("/api/purchase-orders", require("./routes/purchaseOrderRoutes"));
app.use("/api/grns", require("./routes/receivingRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/bff", require("./routes/bffRoutes"));
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
    } catch (error) {
        console.error("Startup failed:", error.message);
        process.exit(1);
    }
};

start();
