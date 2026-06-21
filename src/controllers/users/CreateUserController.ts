import type { FastifyRequest, FastifyReply } from "fastify";
import { createUser } from "../../service/users/createUserService";
import { AppError, EmailAlreadyInUseError, ForbiddenRoleError } from "../../errors/Apperror";

type CreateUserBody = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "client" | "barber" | "admin";
};

export async function createUserController(
  request: FastifyRequest<{ Body: CreateUserBody }>,
  reply: FastifyReply
) {
  const { name, email, password, phone, role } = request.body;

  if (!name || !email || !password) {
    return reply.status(400).send({ error: "name, email e password são obrigatórios." });
  }
  const requesterRole = (request as any).user?.role as
    | "client"
    | "barber"
    | "admin"
    | undefined;

  try {
    const user = await createUser({ name, email, password, phone, role }, requesterRole);
    return reply.status(201).send(user);
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return reply.status(409).send({ error: error.message });
    }
    if (error instanceof ForbiddenRoleError) {
      return reply.status(403).send({ error: error.message });
    }
    if (error instanceof AppError) {
      return reply.status(400).send({ error: error.message });
    }

    request.log.error(error);
    return reply.status(500).send({ error: "Erro interno ao criar usuário." });
  }
}