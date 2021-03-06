import { Application, Router } from 'express';
import { UserController } from '../controllers/user.controller';

export class UserRouter {
  private _app: Application;
  private _controller: UserController;

  constructor(app: Application) {
    this._app = app;
    this._controller = new UserController();
  }

  registerRoutes = () => {
    const router = Router();

    router.get('/login', this._controller.login);
    router.post('/register', this._controller.register);
    router.get('/logout', this._controller.logout);

    this._app.use('/users', router);
  };
}
