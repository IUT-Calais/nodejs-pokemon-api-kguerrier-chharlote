import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../client";
import { Request, Response } from "express";

// Inscription d'un utilisateur
    export const createUser = async (_req: Request, res: Response) => {
    try {
        const { email, password } = _req.body;
        if (!email || !password) {
            res.status(400).send({ message: "Email et mot de passe requis." });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).send({ message: "Email déjà utilisé." });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        res.status(201).send({ message: "Utilisateur créé avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).send({ message: "Erreur serveur." });
    }
};


export const loginUser = async (_req: Request, res: Response)=> {
    try {
        const { email, password } = _req.body;
        if (!email || !password) {
            res.status(400).send({ message: "Email et mot de passe requis." });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(404).send({ message: "Utilisateur non trouvé." });
            return;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(400).send({ message: "Mot de passe incorrect." });
            return;
        }
        
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET as jwt.Secret,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ message: "Connexion réussie.", token });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).send(error);
    }
};

