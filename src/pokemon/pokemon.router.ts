import { Router } from 'express';
import {getPokemon, getPokemons, createPokemon, deletePokemon} from './pokemon.router.controller';
export const pokemonRouter = Router();

// Route pour obtenir la liste des pokemons
pokemonRouter.get('/', getPokemons);

// Route pour obtenir un pokemon avec son id
pokemonRouter.get('/:pokemonCardId', getPokemon);

// Route pour créer un pokemon
pokemonRouter.post('/', createPokemon);

// Route pour mettre à jour un pokemon
pokemonRouter.patch('/:pokemonCardId', createPokemon);

// Route pour supprimer un pokemon
pokemonRouter.delete('/:pokemonCardId', deletePokemon);


