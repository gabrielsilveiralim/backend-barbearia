import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../../config/db";
import { users, type NewUser, type User } from "../../schemas/userSchema";
import { EmailAlreadyInUseError, ForbiddenRoleError } from "../../errors/Apperror";

const SALT_ROUNDS = 10;

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "client" | "barber" | "admin";
};

export type CreateUserResult = Omit<User, "passwordHash">;

export async function createUser(
  input: CreateUserInput,
  requesterRole?: "client" | "barber" | "admin"
): Promise<CreateUserResult> {
  const role = input.role ?? "client";

  if (role !== "client" && requesterRole !== "admin") {
    throw new ForbiddenRoleError();
  }

  const existing = await db.query.users.findFirst({
    where: eq(users.email, input.email),
  });

  if (existing) {
    throw new EmailAlreadyInUseError();
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const newUser: NewUser = {
    name: input.name,
    email: input.email,
    passwordHash,
    phone: input.phone,
    role,
  };

  const [created] = await db.insert(users).values(newUser).returning();

  const { passwordHash: _omit, ...safeUser } = created;
  return safeUser;
}