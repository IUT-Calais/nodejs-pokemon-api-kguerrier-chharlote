import express from 'express';
import { pokemonRouter } from './pokemon/pokemon.router';
import {userRouter} from "./user/user.router";
import yaml from "yaml";
import fs from "fs";
import * as path from "node:path";
import swaggerUi from "swagger-ui-express";



const file = fs.readFileSync(path.join(__dirname, "./swagger.yaml"), "utf8");
const swaggerDocument = yaml.parse(file);

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export const server = app.listen(port);

export function stopServer() {
  server.close();
}


// Route de gestion des pokemons
app.use('/pokemons-cards', pokemonRouter);
app.use('/users', userRouter);






