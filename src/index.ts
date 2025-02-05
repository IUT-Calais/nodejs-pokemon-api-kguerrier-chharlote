import express from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();




export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

// GET de la liste de tous les pokémons
app.get('/pokemons-cards', (_req: Request, res: Response) => {
  // const pokemons = await prisma.pokemonCard.findMany();
  // const pokemons = await prisma.pokemonCard.findMany({ include: { posts: true } });
  res.status(200).send(`Listes des pokemons`);


  // res.status(200).send(pokemons);
})

// GET sur un pokemon en particulier
app.get('/pokemons-cards/:pokemonCardId', (_req: Request, res: Response) => {
  res.status(200).send(`Un pokemon`);
})

// POST, création d'un pokémon
app.post('/pokemons-cards', (_req: Request, res: Response) => {
  res.status(201).send(`Pokemon créé`);
})

// PATCH, modifictaion d'un pokémon
app.patch('/pokemons-cards/:pokemonCardId', (_req: Request, res: Response) => {
  res.status(200).send(`Pokemon modifié`);
})

// DELETE d'un pokémon
app.delete('/pokemons-cards/:pokemonCardId', (_req: Request, res: Response) => {
  res.status(200).send(`Pokemon supprimé`);
})



