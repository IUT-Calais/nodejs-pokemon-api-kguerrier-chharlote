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
app.get('/pokemons-cards', async (_req: Request, res: Response) => {
  const pokemons = await prisma.pokemonCard.findMany({ include: { types: true } });
  res.status(200).send(pokemons);
})

// GET sur un pokemon en particulier
app.get('/pokemons-cards/:pokemonCardId', async (_req: Request, res: Response) => {
  const { pokemonCardId } = _req.params
  const pokemon = await prisma.pokemonCard.findUnique({where:{id: Number(pokemonCardId)}});
  if (pokemon) {
    res.status(200).send(pokemon);
  }else {
    res.status(404).send(`Pokemon ${pokemonCardId} introuvable`);
  }
})

// POST, création d'un pokémon
// app.post(`/pokemons-cards`, async (req, res) => {
//   const { name, pokedexId, types, lifePoints, size, weight, imageUrl } = req.body
//   const result = await prisma.pokemonCard.create({
//     data: {
//       name,
//       pokedexId,
//       types: {
//         connect: {
//           name: types,
//         }
//       },
//       lifePoints,
//       size,
//       weight,
//       imageUrl,
//     //  author: { connect: { email: authorEmail } },
//     },
//   })
//   res.status(200).send(`Pokemon modifié`).json(result);
//
// })

// PATCH, modification d'un pokémon
app.patch('/pokemons-cards/:pokemonCardId', (_req: Request, res: Response) => {
  res.status(200).send(`Pokemon modifié`);
})

// DELETE d'un pokémon
app.delete('/pokemons-cards/:pokemonCardId', async (_req: Request, res: Response) => {
  const { pokemonCardId } = _req.params
    const pokemon = await prisma.pokemonCard.delete({
    where: {
      id: Number(pokemonCardId),
    },
  })
  res.status(200).send(`Pokemon supprimé`).json(pokemon);
})





