
export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

export class EmailAlreadyInUseError extends AppError {
  constructor() {
    super("Este e-mail já está cadastrado.");
    this.name = "EmailAlreadyInUseError";
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("E-mail ou senha inválidos.");
    this.name = "InvalidCredentialsError";
  }
}

export class ForbiddenRoleError extends AppError {
  constructor() {
    super("Você não tem permissão para criar este tipo de usuário.");
    this.name = "ForbiddenRoleError";
  }
}