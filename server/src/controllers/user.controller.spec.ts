import * as sinon from 'sinon';
import { expect } from 'chai';
import 'mocha';
import { mockRes, mockReq } from 'sinon-express-mock';

import { UserController } from './user.controller';
import { IUser } from '../interfaces/user.interface';

import * as authUtil from '../utils/auth.util';
import { mapUserResult } from '../mappers/user.mapper';
import * as tokenUtil from '../utils/token.util';
import { User } from '../app/models/user.model';

describe('User controller', () => {
  const controller = new UserController();
  const res = mockRes();

  const userMock: IUser = {
    id: 'id',
    name: 'name',
    pass: 'pass',
    email: 'email',
  };

  let sandbox: sinon.SinonSandbox;
  beforeEach(() => (sandbox = sinon.createSandbox()));
  afterEach(() => sandbox.restore());

  describe('login method', () => {
    const req = mockReq({
      body: {
        email: 'email',
        pass: '$2b$09$dmzrqMW20phGDI72qHiT6./MT3GBWvOoLIVzjBFqOP.rEShgQqYOe',
      },
    });

    it('should return user', async () => {
      sandbox.stub(User, 'findOne').resolves(userMock);
      sandbox.stub(authUtil, 'comparePassword').resolves(true);
      sandbox.stub(tokenUtil, 'generateToken').resolves(userMock);
      await controller.login(req, res);

      expect(res.json.lastCall.args[0]).to.deep.equal({
        success: true,
        data: mapUserResult(userMock),
      });
    });

    it('should return invalid user error', async () => {
      sandbox.stub(User, 'findOne').resolves(userMock);
      sandbox.stub(authUtil, 'comparePassword').resolves(false);
      await controller.login(req, res);

      expect(res.json.lastCall.args[0]).to.deep.equal(
        'Invalid user or password.',
      );
    });
  });

  describe('register method', () => {
    const req = mockReq({
      body: userMock,
    });

    it('should create and return the user', async () => {
      sandbox.stub(User, 'findOne').resolves();
      sandbox.stub(authUtil, 'generatePassword').resolves(userMock);
      sandbox.stub(tokenUtil, 'generateToken').resolves(userMock);
      sandbox.stub(User, 'create').resolves(userMock);

      await controller.register(req, res);

      expect(res.json.lastCall.args[0]).to.deep.equal({
        success: true,
        data: mapUserResult(userMock),
      });
    });

    it('should return user already registered error', async () => {
      sandbox.stub(User, 'findOne').resolves(userMock);
      sandbox.stub(authUtil, 'generatePassword').resolves();
      sandbox.stub(User, 'create').resolves();

      await controller.register(req, res);

      expect(res.json.lastCall.args[0]).to.deep.equal(
        'Email already registered.',
      );
    });
  });
});
