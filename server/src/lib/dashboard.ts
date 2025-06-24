import { Request, Response, NextFunction } from 'express';
import Model from './model';
const PromiseRouter = require('express-promise-router');

/**
 * Dashboard - Responsible for providing dashboard-related data and endpoints.
 */
export default class Dashboard {
  private model: Model;
  constructor(model: Model) {
    this.model = model;
  }

  getRouter() {
    const router = PromiseRouter({ mergeParams: true });

    // Middleware example
    router.use((req: Request, res: Response, next: NextFunction) => {
      // Example middleware functionality
      console.log(`Request to Dashboard API: ${req.method} ${req.url}`);
      next();
    });

    // Define routes
    router.get('/hello', this.sayHello);
    router.get('/bye', this.sayBye);
    router.get('/sentences', this.getClips);

    return router;
  }

  getClips = async (request: Request, response: Response) => {
    response.json(await this.model.db.findAllsentences());
  };

  /**
   * Say Hello Endpoint
   */
  sayHello = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json({ message: 'Hello from the Dashboard API!' });
    } catch (error) {
      console.error('Failed to process hello endpoint:', error);
      res.status(500).json({ error: 'Failed to process hello endpoint' });
    }
  };

  /**
   * Say Bye Endpoint
   */
  sayBye = async (req: Request, res: Response): Promise<void> => {
    try {
      res.json({ message: 'Goodbye from the Dashboard API!' });
    } catch (error) {
      console.error('Failed to process bye endpoint:', error);
      res.status(500).json({ error: 'Failed to process bye endpoint' });
    }
  };
}
