
import prisma from "../client";
import{ Request, Response } from 'express';


// Récuépration des pokémons
export const getPokemons = async (_req: Request, res: Response) => {
    const pokemons = await prisma.pokemonCard.findMany({ include: { types: true } });
    res.status(200).send(pokemons);
}

// Récuépration d'un pokemon avec son id
export const getPokemon = async (_req: Request, res: Response) => {
    const { pokemonCardId } = _req.params
    const pokemon = await prisma.pokemonCard.findUnique({where:{id: Number(pokemonCardId)}});
    if (pokemon) {
        res.status(200).send(pokemon);
    }else {
        res.status(404).send(`Pokemon ${pokemonCardId} introuvable`);
    }
}

// Création d'un pokemon
export const createPokemon = async (_req: Request, res: Response) => {

    const { name, pokedexId, types, lifePoints, size, weight, imageUrl } = _req.body
      const result = await prisma.pokemonCard.create({
        data: {
          name : name,
          pokedexId : Number(pokedexId),
          types: {
            connect: {
              name: types,
            }
          },
          lifePoints : lifePoints,
          size : size,
          weight: weight,
          imageUrl: imageUrl,
        },
      })
      res.status(200).send(`Pokemon modifié`).json(result);
}

// Mise à jour d'un pokemon
export const updatePokemon = async (req: Request, res: Response) => {
    const { pokemonCardId } = req.params;
    const dataToUpdate = req.body;

    const parsedId = parseInt(pokemonCardId);
    if (isNaN(parsedId)) {
        return res.status(400).send("ID invalide");
    }

    try {
        const updatedPokemon = await prisma.pokemonCard.update({
            where: { id: parsedId },
            data: dataToUpdate,
        });
        return res.status(200).json(updatedPokemon);
    } catch (error) {
        return res.status(404).send(`Impossible de mettre à jour : Pokémon ${pokemonCardId} introuvable`);
    }
};


// Suppression d'un pokemon
export const deletePokemon = async (_req: Request, res: Response) => {
    const { pokemonCardId } = _req.params
    const pokemon = await prisma.pokemonCard.delete({
        where: {
            id: Number(pokemonCardId),
        },
    })
    res.status(200).send(`Pokemon supprimé`).json(pokemon);
}

