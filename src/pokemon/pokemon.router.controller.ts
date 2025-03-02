import prisma from "../client";
import { Request, Response } from "express";

// Récupération des pokémons
export const getPokemons = async (_req: Request, res: Response) => {
    try {
        const pokemons = await prisma.pokemonCard.findMany({ include: { types: true } });
        res.status(200).send(pokemons);
    } catch (error) {
        console.error("Erreur lors de la récupération des Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la récupération des Pokémon." });
    }
};

// Récupération d'un Pokémon avec son id
export const getPokemon = async (_req: Request, res: Response) => {
    try {
        const { pokemonCardId } = _req.params;
        const pokemon = await prisma.pokemonCard.findUnique({ where: { id: Number(pokemonCardId) } });
        if (pokemon) {
            res.status(200).send(pokemon);
        } else {
            res.status(404).send({ message: `Pokemon ${pokemonCardId} introuvable` });
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la récupération du Pokémon." });
    }
};

// Création d'un Pokémon
export const createPokemon = async (_req: Request, res: Response) => {
    try {
        const { name, pokedexId, types, lifePoints, size, weight, imageUrl } = _req.body;
        const result = await prisma.pokemonCard.create({
            data: {
                name: name,
                pokedexId: Number(pokedexId),
                types: {
                    connect: {
                        name: types,
                    },
                },
                lifePoints: lifePoints,
                size: size,
                weight: weight,
                imageUrl: imageUrl,
            },
        });
        res.status(201).json(result);
    } catch (error) {
        console.error("Erreur lors de la création du Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la création du Pokémon." });
    }
};

// Mise à jour d'un pokemon
export const updatePokemon  = async (_req: Request, res: Response) => {
    try {
        const pokemonCardId = parseInt(_req.params.pokemonCardId);

        if (isNaN(pokemonCardId)) {
            res.status(400).send({ message: "L'ID du Pokémon est invalide." });
        }

        const { name, typeId, pokedexId, lifePoints, size, weight, imageUrl } = _req.body;

        if (!name || !typeId || !pokedexId || !lifePoints) {
            res.status(400).json({ message: "Tous les champs sont requis." });
        }

        const updatedPokemonCard = await prisma.pokemonCard.update({
            where: { id: pokemonCardId },
            data: { name, typeId, pokedexId, lifePoints, size, weight, imageUrl },
        });

        res.status(200).json(updatedPokemonCard);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la carte Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la mise à jour de la carte Pokémon." });
    }
}


// Suppression d'un pokemon
export const deletePokemon  = async (_req: Request, res: Response) => {
    try {
        const pokemonCardId = parseInt(_req.params.pokemonCardId);

        if (isNaN(pokemonCardId)) {
            res.status(400).send({ message: "L'ID du Pokémon est invalide." });
        }

        const deletedPokemonCard = await prisma.pokemonCard.delete({
            where: { id: pokemonCardId }
        });

        res.status(200).json(deletedPokemonCard);
    } catch (error) {
        console.error("Erreur lors de la suppression de la carte Pokémon:", error);
        res.status(500).send({ message: "Une erreur est survenue lors de la suppression de la carte Pokémon." });
    }
}

