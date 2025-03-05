import { Router } from "express";
import { loginUser, createUser} from "./user.router.controller";

export const userRouter = Router();

// Route pour inscrire un utilisateur
userRouter.post("/", createUser);

// Route pour connecter un utilisateur
userRouter.post("/login", loginUser);


