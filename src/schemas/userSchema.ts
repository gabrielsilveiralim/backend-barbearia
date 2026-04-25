import { z } from 'zod';

export const createUserSchema = z.object({
    body: z.object({
        name: z
            .string({ message: "Nome precisa ser um texto"})
            .min(3, { message: "Nome precisa conter no mínimo 3 caracteres"}),
        email: z.email({ message: "Email inválido" }),
        password: z
            .string()
            .min(6, { message: "Senha precisa conter no mínimo 6 caracteres" })
    }),
});