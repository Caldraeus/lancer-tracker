import express from 'express';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const expressSetup = async () => {
    const app = express();

    // Generate a random secret key
    const secretKey = crypto.randomBytes(32).toString('hex');

    // Set up express-session middleware
    app.use(session({
        secret: secretKey, // Use the generated secret key
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set secure to true if using HTTPS
    }));

    // Add body parsing middleware
    app.use(express.json());

    // Serve static files
    const publicPath = path.resolve(__dirname, '..', '..', 'public');
    app.use(express.static(publicPath));

    // Serve artwork images
    const folderPath = path.resolve(__dirname, '..', '..', 'public', 'assets', 'artwork');
    app.use("/artwork", express.static(folderPath));

    // Endpoint to serve artwork images
    app.get("/artwork", (req, res) => {
        fs.readdir(folderPath, (err, files) => {
            if (err) {
                res.status(500).send("Error reading the folder");
                return;
            }
            const imageFiles = files.filter(file => file.endsWith(".jpg") || file.endsWith(".png"));
            res.json(imageFiles);
        });
    });

    // Load and apply routes
    const routePath = path.join(__dirname, '..', 'routes');
    const files = await fs.promises.readdir(routePath);

    for (const file of files) {
        if (file.endsWith('.js')) {
            const route = await import(path.join(routePath, file));
            if (route.default) {
                app.use(route.default);
                console.log(`Loaded ${file}`);
            }
        }
    }

    // Define routes
    app.get('/', (req, res) => {
        res.sendFile(path.join(publicPath, 'html', 'index.html'));
    });

    return app;
};

export default expressSetup;