import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import propertyRouter from "./modules/properties/property.routes.js";
import agentRouter from "./modules/agents/agent.routes.js";
import favoriteRouter from "./modules/favorites/favorite.routes.js";
import propertyImageRouter from "./modules/property-images/property-image.routes.js";
import inquiryRouter from "./modules/inquiries/inquiry.routes.js";
import messageRouter from "./modules/messages/message.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";

const app = express();

// CORS — allow requests from the frontend origin
const allowedOrigins = [
  "http://localhost:5173", // local dev
  process.env.CLIENT_URL,  // production frontend URL (set on Render)
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/agents", agentRouter);
app.use("/api/v1/favorites", favoriteRouter);
app.use("/api/v1/properties/:propertyId/images", propertyImageRouter);
app.use("/api/v1", inquiryRouter);
app.use("/api/v1", messageRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(errorMiddleware);

export default app;