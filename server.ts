/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support parsing JSON bodies
  app.use(express.json());

  // API Route: Server health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "StethoNotes Full-Stack Live!" });
  });

  // API Route: Create Cashfree Checkout Session
  app.post("/api/cashfree/create-session", async (req, res) => {
    const { amount, customerEmail, customerPhone, customerName } = req.body;

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const isProd = process.env.CASHFREE_ENVIRONMENT === "production";

    // Detect placeholder values to gracefully fallback to simulated Sandbox/Demo mode
    const isPlaceholder = (val?: string) => {
      if (!val) return true;
      const lower = val.trim().toLowerCase();
      return (
        lower === "" ||
        lower.includes("placeholder") ||
        lower.includes("your_") ||
        lower.includes("xkeysib") ||
        lower.includes("example") ||
        lower.includes("key_here") ||
        val === "your_cashfree_app_id" ||
        val === "your_cashfree_secret_key"
      );
    };

    if (!appId || !secretKey || isPlaceholder(appId) || isPlaceholder(secretKey)) {
      return res.json({
        success: true,
        demoMode: true,
        paymentSessionId: `session_demo_${Math.random().toString(36).substring(2, 15)}`,
        orderId: `order_demo_${Date.now()}`,
        message: "Running Cashfree in Demo Mode. Provide valid CASHFREE_APP_ID & CASHFREE_SECRET_KEY to connect your live dashboard."
      });
    }

    const orderId = `order_${Date.now()}`;
    const baseUrl = isProd 
      ? "https://api.cashfree.com/pg/orders" 
      : "https://sandbox.cashfree.com/pg/orders";

    // Cashfree strictly requires HTTPS for return_url (except for sandbox development sometimes, but forcing it is always safest)
    const rawOrigin = req.headers.origin || "https://stethonotes.com";
    const secureOrigin = rawOrigin.replace(/^http:\/\//i, "https://");

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-client-id": appId.trim(),
          "x-client-secret": secretKey.trim(),
          "x-api-version": "2023-08-01"
        },
        body: JSON.stringify({
          order_id: orderId,
          order_amount: parseFloat(amount || "149"),
          order_currency: "INR",
          customer_details: {
            customer_id: `cust_${Math.floor(Math.random() * 100000)}`,
            customer_email: customerEmail || "customer@stethonotes.com",
            customer_phone: customerPhone || "9999999999",
            customer_name: customerName || "Guest Doctor"
          },
          order_meta: {
            return_url: `${secureOrigin}/api/cashfree/verify?order_id={order_id}`
          }
        })
      });

      const contentType = response.headers.get("content-type") || "";

      if (!response.ok) {
        let errorMessage = "Failed to initiate Cashfree payment session.";
        if (contentType.includes("application/json")) {
          try {
            const errBody = await response.json();
            errorMessage = errBody.message || JSON.stringify(errBody);
          } catch (e) {
            errorMessage = `Status ${response.status}: Failed to parse JSON error response.`;
          }
        } else {
          const rawText = await response.text();
          errorMessage = `Status ${response.status}: ${rawText.substring(0, 250)}`;
        }

        return res.status(response.status).json({
          success: false,
          error: errorMessage
        });
      }

      if (contentType.includes("application/json")) {
        const orderData = await response.json();
        return res.json({
          success: true,
          paymentSessionId: orderData.payment_session_id,
          orderId: orderData.order_id,
          environment: process.env.CASHFREE_ENVIRONMENT || "sandbox",
          demoMode: false
        });
      } else {
        const rawText = await response.text();
        return res.status(500).json({
          success: false,
          error: `Invalid non-JSON response from Cashfree: ${rawText.substring(0, 200)}`
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server error during Cashfree session creation."
      });
    }
  });

  // API Route: Send secure transactional emails via Brevo
  app.post("/api/send-email", async (req, res) => {
    const { toEmail, toName, subject, htmlContent } = req.body;

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || "deliveries@stethonotes.com";
    const senderName = process.env.BREVO_SENDER_NAME || "StethoNotes Delivery";

    if (!toEmail || !subject || !htmlContent) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameters: toEmail, subject, and htmlContent."
      });
    }

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "BREVO_API_KEY is not configured in the developer secrets environment."
      });
    }

    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey
        },
        body: JSON.stringify({
          sender: {
            name: senderName,
            email: senderEmail
          },
          to: [
            {
              email: toEmail,
              name: toName || toEmail.split("@")[0]
            }
          ],
          subject: subject,
          htmlContent: htmlContent
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return res.status(response.status).json({
          success: false,
          error: errorData.message || "Failed to deliver email through Brevo SMTP."
        });
      }

      const data = await response.json();
      return res.json({
        success: true,
        messageId: data.messageId,
        info: "Email dispatched successfully via Brevo."
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || "Internal server error during email dispatch."
      });
    }
  });

  // Vite middleware for dev vs prod static asset delivery
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StethoNotes server running on http://localhost:${PORT}`);
  });
}

startServer();
