import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";
import { userRoutes } from "./routes/userRoutes";

const app = Fastify();

app.register(cors);
app.register(userRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen({ port: PORT }, () => {
  console.log("Server is running on port " + PORT);
});