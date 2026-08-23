import express from "express";

import { errorMiddleware } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js"
import userRoutes from "./modules/users/user.routes.js"
import propertyRouter from "./modules/properties/property.routes.js";
import agentRouter from "./modules/agents/agent.routes.js";
import favoriteRouter from "./modules/favorites/favorite.routes.js";
import propertyImageRouter from "./modules/property-images/property-image.routes.js"
import inquiryRouter from "./modules/inquiries/inquiry.routes.js"
import messageRouter from "./modules/messages/message.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";


const app = express();

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

// this must be at end
app.use(errorMiddleware);

export default app;

//ADMIN_EMAIL="admin@estatehub.com"
//ADMIN_PASSWORD="AdminPass123!"