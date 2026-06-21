import type { FastifyInstance } from "fastify";
import { createUserController } from "../controllers/users/createUserController";
import { loginUserController } from "../controllers/users/loginUserController";

export async function userRoutes(app: FastifyInstance) {
  app.post("/users", createUserController);
  app.post("/login", loginUserController);
}