import { Request, Response } from "express";
import { CreateUserService } from "../../service/users/CreateUserService";

class CreateUserController {
    async handle(req: Request, res: Response) {
        const { name, email, password } = req.body;
        console.log("Received data:", { name, email, password });

        const createUserService = new CreateUserService();
        const user =await createUserService.execute();
        
        res.json(user);
    }
}

export { CreateUserController };