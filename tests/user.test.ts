import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";



describe('User API', () => {

    describe('POST /users', () => {
        it('should create a new user', async () => {
            const newUser = {
                email: 'admin@example.com',
                password: 'password'
            };

            prismaMock.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            prismaMock.user.create.mockResolvedValue({
                id: 1,
                email: newUser.email,
                password: 'hashedPassword',
            });

            const response = await request(app).post('/users').send(newUser);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({ message: 'Utilisateur créé avec succès.' });
        });

        it('should return 400 if fields are missing', async () => {
            const response = await request(app).post('/users').send({ email: '' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Email et mot de passe requis.' });
        });

        it('should return 400 if user already exists', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 1, email: 'admin@example.com',   password: 'hashedPassword', });

            const response = await request(app).post('/users').send({
                email: 'test@example.com',
                password: 'password'
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Email déjà utilisé.' });
        });

        it('should return 500 if an error during creation', async () => {
            prismaMock.user.findUnique.mockRejectedValue(new Error('Erreur'));

            const response = await request(app).post('/users').send({
                email: 'admin@example.com',
                password: 'password'
            });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Erreur serveur.' });
        });
    });


    describe('POST /users/login', () => {
        const mockUser = {
            id: 1,
            email: 'admin@example.com',
            password: 'password'
        };

        it('should log in a user and return a token', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

            const response = await request(app).post('/users/login').send({
                email: 'admin@example.com',
                password: 'correctPassword'
            });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Connexion réussie.',
                token: 'mockedToken'
            });
        });

        it('should return 400 if fields are missing', async () => {
            const response = await request(app).post('/users/login').send({ email: '' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Email et mot de passe requis.' });
        });

        it('should return 404 if user not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const response = await request(app).post('/users/login').send({
                email: 'unknown@example.com',
                password: 'anyPassword'
            });

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Utilisateur non trouvé.' });
        });

        it('should return 400 if password is incorrect', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const response = await request(app).post('/users/login').send({
                email: 'admin@example.com',
                password: 'wrongPassword'
            });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Mot de passe incorrect.' });
        });

        it('should return 500 if an error during login', async () => {
            prismaMock.user.findUnique.mockRejectedValue(new Error('Erreur'));

            const response = await request(app).post('/users/login').send({
                email: 'admin@example.com',
                password: 'password'
            });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({message: "Erreur serveur."});});

    });

    describe('GET /users', () => {
        it('should fetch all Users', async () => {
            const mockUsers = [
                {
                    id: 1,
                    email: "admin3@gmail.com",
                    password: "$2b$10$9/BRvSSQZiUcD6UQ1uZQ0uIAQmowq65rVGvhPl6hKW3m0U1GcGo8O"
                },
                {
                    id: 4,
                    email: "admin@gmail.com",
                    password: "$2b$10$wElvNolTe7mtkFCe7yZtcOucz72Vl6t67jVHbkIfhFi6NRJAL3n.."
                }
            ];

            prismaMock.user.findMany.mockResolvedValue(mockUsers);

            const response = await request(app).get('/users');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUsers);
        });

        it('should return 500 if an error during get all', async () => {
            prismaMock.user.findMany.mockRejectedValue(new Error('Erreur'));

            const response = await request(app).get('/users');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Une erreur est survenue lors de la récupération des utilisateurs." });
        });

    });

    describe('GET /users/:userId', () => {
        const mockUser = {
            id: 4,
            email: "admin@gmail.com",
            password: "$2b$10$wElvNolTe7mtkFCe7yZtcOucz72Vl6t67jVHbkIfhFi6NRJAL3n.."
        };

        it('should fetch a uUser by ID', async () => {
            prismaMock.user.findUnique.mockResolvedValue(mockUser);

            const response = await request(app).get('/users/4');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockUser);
        });

        it('should return 404 if User is not found', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);
            const response = await request(app).get('/users/666');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message:  `Utilisateur 666 introuvable` });
        });

        it('should return 500 if an error during get', async () => {
            prismaMock.user.findUnique.mockRejectedValue(new Error('Erreur'));

            const response = await request(app).get('/users/4');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Une erreur est survenue lors de la récupération de l'utilisateur." });
        });

    });

    describe('PATCH /users/:userId', () => {
        const updatedData = {
            email: "adminUpdated@gmail.com",
            password: "pwdUpdated"
        };
        it('should update an existing User', async () => {
            const userId = 3;

            const updatedUser = {id: userId, ...updatedData};

            prismaMock.user.update.mockResolvedValue(updatedUser);

            const response = await request(app)
                .patch(`/users/${userId}`)
                .send(updatedData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(updatedUser);
        });

        it('should return 400 if required fields are missing', async () => {
            const response = await request(app)
                .patch('/users/3')
                .send({ name: "Nothing" });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "Tous les champs sont requis." });
        });

        it('should return 400 for invalid ID', async () => {
            const response = await request(app)
                .patch('/users/id')
                .send({updatedData});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "L'ID de l'utilisateur est invalide." });
        });

        it('should return 500 if an error during update', async () => {
            prismaMock.user.update.mockRejectedValue(new Error('Erreur'));

            const response = await request(app)
                .patch(`/users/3`)
                .send(updatedData);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Une erreur est survenue lors de la mise à jour de l'utilisateur." });
        });

    });


    describe('DELETE /users/:userId', () => {
        it('should delete a User by ID', async () => {
            const deletedPokemon = {
                id: 3,
                email: "admin3@gmail.com",
                password: "$2b$10$9/BRvSSQZiUcD6UQ1uZQ0uIAQmowq65rVGvhPl6hKW3m0U1GcGo8O"
            };

            prismaMock.user.delete.mockResolvedValue(deletedPokemon);

            const response = await request(app)
                .delete('/users/3')

            expect(response.status).toBe(200);
            expect(response.body).toEqual({message: "Utilisateur 3 supprimé"});
        });

        it('should return 400 for invalid ID', async () => {
            const response = await request(app)
                .delete('/users/id')

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: "L'ID de l'utilisateur est invalide." });
        });

        it('should return 500 if an error during deletion', async () => {
            prismaMock.user.delete.mockRejectedValue(new Error('Erreur'));

            const response = await request(app)
                .delete('/users/100')

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Une erreur est survenue lors de la suppression de l'utilisateur." });
        });
    });
});


