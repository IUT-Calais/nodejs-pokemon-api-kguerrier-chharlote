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
            "data": { email, "password": hashedPassword },
        });

        res.status(201).send({ message: "Utilisateur créé avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).send({ message: "Erreur serveur." });
    }
};

// Connexion d'un utilisateur
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


// Récupération des utilisateurs
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({});
        res.status(200).send(users);
        return
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la récupération des utilisateurs." });
        return
    }
};

// Récupération d'un utilisateur avec son id
export const getUser = async (_req: Request, res: Response) => {
    try {
        const { userId } = _req.params;
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (user) {
            res.status(200).send(user);
            return
        } else {
            res.status(404).send({ message: `Utilisateur ${userId} introuvable` });
            return
        }
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utiliateur:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la récupération des utilisateurs." });
        return
    }
};

// Mise à jour d'un utilisateur
export const updateUser  = async (_req: Request, res: Response) => {
    try {
        const userId = parseInt(_req.params.userId);

        if (isNaN(userId)) {
            res.status(400).send({ message: "L'ID de l'utilisateur est invalide." });
            return
        }

        const { email, password} = _req.body;

        if (!email || !password) {
            res.status(400).send({ message: "Tous les champs sont requis." });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { email, "password": hashedPassword},
        });

        res.status(200).json(updatedUser);
        return
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur':", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la mise à jour de l'utilisateur." });
        return
    }
}

// Suppression d'un utilisateur
export const deleteUser  = async (_req: Request, res: Response) => {
    try {
        const userId = parseInt(_req.params.userId);

        if (isNaN(userId)) {
            res.status(400).send({ message: "L'ID de l'utilisateur est invalide." });
            return
        }

        await prisma.user.delete({
            where: { id: userId }
        });
        //
        // res.status(200).json(deletedUser);
        res.status(200).send({ message: `Utilisateur ${userId} supprimé` });
        return
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la suppression de l'utilisateur." });
        return
    }
}

