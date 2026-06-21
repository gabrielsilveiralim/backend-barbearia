import type { FastifyRequest, FastifyReply } from "fastify";
import { loginUser } from "../../service/users/loginUserService";
import { AppError, InvalidCredentialsError } from "../../errors/Apperror";

type LoginBody = {
  email: string;
  password: string;
};

export async function loginUserController(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
) {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.status(400).send({ error: "email e password são obrigatórios." });
  }

  try {
    const result = await loginUser({ email, password });
    return reply.status(200).send(result);
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ error: error.message });
    }
    if (error instanceof AppError) {
      return reply.status(400).send({ error: error.message });
    }

    request.log.error(error);
    return reply.status(500).send({ error: "Erro interno ao autenticar." });
  }
}