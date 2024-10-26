import express, { Request, Response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(morgan('dev'));

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express Axios API with TypeScript',
            version: '1.0.0',
            description: 'A simple Express API with Axios and OpenAPI definition',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['./src/app.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/data:
 *   get:
 *     summary: Retrieve data from a third-party API
 *     responses:
 *       200:
 *         description: Successfully retrieved data
 *       500:
 *         description: Error fetching data
 */
app.get('/api/data', async (req: Request, res: Response) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching data from the third-party API');
    }
});

/**
 * @swagger
 * /api/data:
 *   post:
 *     summary: Send data to a third-party API
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Successfully created resource
 *       500:
 *         description: Error sending data
 */
app.post('/api/data', async (req: Request, res: Response) => {
    try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/posts', req.body);
        res.status(201).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error sending data to the third-party API');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
