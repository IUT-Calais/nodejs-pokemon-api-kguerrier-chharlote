import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('PokemonCard API', () => {
  describe('GET /pokemon-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        {
          id: 1,
          name: "Bulbizarre",
          pokedexId: 1,
          typeId: 1,
          lifePoints: 40,
          size: 0.7,
          weight: 6.9,
          imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png",
          types: {
            id: 1,
            name: "Grass"
          }
        },
        {
          id: 2,
          name: "Carapuce",
          pokedexId: 7,
          typeId: 3,
          lifePoints: 44,
          size: 0.7,
          weight: 9,
          imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png",
          types: {
            id: 3,
            name: "Water"
          }
        }
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemons-cards');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPokemonCards);
    });
  });

  describe('GET /pokemon-cards/:pokemonCardId', () => {
    const mockPokemonCard = {
      "id": 1,
      "name": "Pikachu",
      "pokedexId": 25,
      "lifePoints": 100,
      "size": 0.4,
      "weight": 6,
      "imageUrl": "https://example.com/pikachu.png",
      "typeId": 2
    };
    it('should fetch a PokemonCard by ID', async () => {

      it('should fetch a PokemonCard by ID', async () => {
        prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);

        const response = await request(app).get('/pokemons-cards/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockPokemonCard);
      });
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      const response = await request(app).get('/pokemons-cards/666');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message:  `Pokemon 666 introuvable` });
    });
  });

  describe('POST /pokemons-cards', () => {
    it('should create a new PokemonCard', async () => {
      const newPokemon = {
        name: "Salamèche",
        pokedexId: 4,
        typeId: 2,
        lifePoints: 39,
        size: 0.6,
        weight: 8.5,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
      };
      const createdPokemon = {
        id: 3,
        name: "Salamèche",
        pokedexId: 4,
        typeId: 2,
        lifePoints: 39,
        size: 0.6,
        weight: 8.5,
        imageUrl: "https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png",
      };


      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemon);

      const response = await request(app)
          .post('/pokemons-cards')
          .set('Authorization', 'Bearer mockedToken')
          .send(newPokemon);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdPokemon);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/pokemons-cards').set('Authorization', 'Bearer mockedToken')
          .send({ name: "Test" });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Tous les champs sont requis." });
    });
  });

});

