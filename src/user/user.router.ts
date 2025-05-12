import { Router } from "express";
import {loginUser, createUser, getUsers, getUser, deleteUser, updateUser} from "./user.router.controller";


export const userRouter = Router();

// Route pour inscrire un utilisateur
userRouter.post("/", createUser);

// Route pour connecter un utilisateur
userRouter.post("/login", loginUser);

// Route pour récupérer tous les utilisateurs
userRouter.get("/", getUsers);

// Route pour obtenir un utilisateur par son ID
userRouter.get("/:userId", getUser);

// Route pour mettre à jour un utilisateur
userRouter.patch("/:userId", updateUser);

// Route pour supprimer un utilisateur
userRouter.delete("/:userId", deleteUser);


