import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import printifyRoutes from "./routes/printifyRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import printifyWebhookRoutes from "./routes/printifyWebhookRoutes.js";
import validateEnvironment from "./config/env.js";


const app = express();

validateEnvironment();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

connectDB();

// --------------------------------
// SECURITY HEADERS
// --------------------------------

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);


app.use(
  express.json({
    verify: (req, res, buffer) => {
      if (
        req.originalUrl.startsWith(
          "/api/webhooks/printify"
        )
      ) {
        req.rawBody = buffer;
      }
    },
  })
);

// --------------------------------
// GENERAL RATE LIMIT
// --------------------------------

const generalLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 300,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
      message:
        "Too many requests. Please try again later.",
    },
  });

app.use(
  "/api",
  (req, res, next) => {
    if (
      req.originalUrl.startsWith(
        "/api/webhooks/printify"
      )
    ) {
      return next();
    }

    return generalLimiter(
      req,
      res,
      next
    );
  }
);


app.use("/api/printify", printifyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use(
  "/api/webhooks/printify",
  printifyWebhookRoutes
);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vega Strado API is running",
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Vega Strado API",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Vega Strado API running on http://localhost:${PORT}`);
});