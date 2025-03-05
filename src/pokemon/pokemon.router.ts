import { Router } from "express";
import { getPokemon, getPokemons, createPokemon, updatePokemon, deletePokemon } from "./pokemon.router.controller";
import { verifyJWT } from "../common/jwt.middleware";

export const pokemonRouter = Router();

// Route pour obtenir la liste des pokémons
pokemonRouter.get("/", getPokemons);

// Route pour obtenir un pokémon par son ID
pokemonRouter.get("/:pokemonCardId", getPokemon);

// Route pour créer un pokémon
pokemonRouter.post("/", verifyJWT, createPokemon);

// Route pour mettre à jour un pokémon
pokemonRouter.patch("/:pokemonCardId", verifyJWT, updatePokemon);

// Route pour supprimer un pokémon
pokemonRouter.delete("/:pokemonCardId", verifyJWT, deletePokemon);
