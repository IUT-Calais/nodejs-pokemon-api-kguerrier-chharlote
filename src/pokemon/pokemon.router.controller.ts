
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
      name,
      pokedexId,
      types: {
        connect: {
          name: types,
        }
      },
      lifePoints,
      size,
      weight,
      imageUrl,
    },
  })
  res.status(200).send(`Pokemon modifié`).json(result);

}

// Mise à jour d'un pokemon
export const updatePokemon = async (_req: Request, res: Response) => {}

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

