import 'reflect-metadata'
import compression from 'compression';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import './data-source';

import { Controller } from './utils/interfaces/interface';
import ErrorMiddleware from './middleware/errorHandler';
import { NoEntryError } from './utils/requestUtils/ApiError';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }))
        this.express.use(compression())
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use('/api/v1', controller.router);
        })

        this.express.use('*', (req, res, next) => {
            next(new NoEntryError(`Could not find ${req.originalUrl} on this server.`));
        });
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware)
    }

    private initializeDatabaseConnection(): void {
        process.on('SIGINT', async () => {
            process.exit(0);
        });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`\n✔ Server is listening on port ${this.port} on: `); // eslint-disable-line
            console.log(`  localhost: http://localhost:${this.port}`); // eslint-disable-line
        })
    }
}

export default App;