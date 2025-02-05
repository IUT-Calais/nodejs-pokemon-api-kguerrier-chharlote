import { Router } from 'express';
import {createUser, loginUser} from './user.router.controller';
export const userRouteur = Router();

// Route pour obtenir la liste des pokemons
userRouteur.post('/', createUser);

userRouteur.post('/login', loginUser);


