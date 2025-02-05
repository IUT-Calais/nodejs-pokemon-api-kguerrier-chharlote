import prisma from "../client";
import{ Request, Response } from 'express';


// Création d'un User
export const createUser = async (_req: Request, res: Response) => {
    res.status(201).send("User Created");
}

// Connexion d'un User
export const loginUser = async (_req: Request, res: Response) => {

    res.status(200).send("User connected");
}