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
    });

});


