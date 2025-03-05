import express from 'express';
import { pokemonRouter } from './pokemon/pokemon.router';
import {userRouter} from "./user/user.router";

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

export const server = app.listen(port);

export function stopServer() {
  server.close();
}

// Route de gestion des pokemons
app.use('/pokemons-cards', pokemonRouter);
app.use('/users', userRouter);






