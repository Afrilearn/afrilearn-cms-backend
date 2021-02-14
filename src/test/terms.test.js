import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Term from '../db/models/terms.model';
import userUtils from '../utils/user.utils';
import Response from '../utils/response.utils';

import app from '../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

const term = {
  name: 'TestTerm1',
};
const termUpdate = {
  name: 'TestTerm2',
};
const invalidToken = 'invalid.jwt.token';
const staffToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209ab2792e63fc841de3c',
  'Staff User',
);
const moderatorToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209c32792e63fc841de3d',
  'Moderator User',
);
const adminToken = userUtils.generateToken(
  mongoose.Types.ObjectId(),
  '602209d72792e63fc841de3e',
  'Administrator User',
);

const baseUrl = '/api/v1/term';
describe('TERMS', () => {
  describe(`/GET ${baseUrl}`, () => {
    describe('Successful fetch', () => {
      before(async () => {
        await Term.deleteMany();
        const terms = [];
        for (let i = 1; i < 4; i += 1) {
          terms.push(
            (async () => {
              await Term.create({ ...term, name: `TermTesst${i}` });
            })(),
          );
        }
        await Promise.all(terms);
      });
      after((done) => {
        Term.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should fetch all terms for an admin', (done) => {
        chai
          .request(app)
          .get(baseUrl)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('terms');
            res.body.data.terms.length.should.equals(3);
            const names = res.body.data.terms.map((term) => term.name);
            for (let i = 1; i < 4; i += 1) {
              names.should.include(`TermTesst${i}`);
            }
            done();
          });
      });
      it('should fetch all subjects for a moderator', (done) => {
        chai
          .request(app)
          .get(baseUrl)
          .set('token', moderatorToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('terms');
            res.body.data.terms.length.should.equals(3);
            const names = res.body.data.terms.map((term) => term.name);
            for (let i = 1; i < 4; i += 1) {
              names.should.include(`TermTesst${i}`);
            }
            done();
          });
      });
      it('should fetch all subjects for a staff', (done) => {
        chai
          .request(app)
          .get(baseUrl)
          .set('token', staffToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('terms');
            res.body.data.terms.length.should.equals(3);
            const names = res.body.data.terms.map((term) => term.name);
            for (let i = 1; i < 4; i += 1) {
              names.should.include(`TermTesst${i}`);
            }
            done();
          });
      });
    });

    describe('FAKE INTERNAL SERVER ERROR', () => {
      let stub;
      before(() => {
        stub = sinon.stub(Response, 'Success').throws(new Error('error'));
      });
      after(() => {
        stub.restore();
      });
      it('returns status of 500', (done) => {
        chai
          .request(app)
          .get(baseUrl)
          .set('token', adminToken)
          .send(term)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Error fetching terms');
            done();
          });
      });
    });
  });

  describe(`/POST ${baseUrl}`, () => {
    describe('SUCCESSFUL TERM CREATION', () => {
      beforeEach((done) => {
        Term.deleteMany((err) => {
          if (!err) done();
        });
      });
      afterEach((done) => {
        Term.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should create term if request is valid and user is admin', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', adminToken)
          .send(term)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('term');
            res.body.data.term.should.have
              .property('name')
              .to.equals(term.name);
            res.body.data.term.should.have.property('createdAt');
            res.body.data.term.should.have.property('updatedAt');
            done();
          });
      });
      it('should create term if request is valid and user is moderator', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', moderatorToken)
          .send(term)
          .end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have.property('term');
            res.body.data.term.should.have
              .property('name')
              .to.equals(term.name);
            res.body.data.term.should.have.property('createdAt');
            res.body.data.term.should.have.property('updatedAt');
            done();
          });
      });
    });
    describe('FAKE INTERNAL SERVER ERROR', () => {
      let stub;
      before(() => {
        stub = sinon.stub(Response, 'Success').throws(new Error('error'));
      });
      after(() => {
        stub.restore();
      });
      it('returns status of 500', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', adminToken)
          .send(term)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Error creating term');
            done();
          });
      });
    });
    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .send(term)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', invalidToken)
          .send(term)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('ADMIN ACCESS', () => {
      it('should return 401 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', staffToken)
          .send(term)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('INPUT VALIDATION', () => {
      let request;
      let dynamicTerm;
      beforeEach(() => {
        request = chai.request(app).post(baseUrl).set('token', adminToken);
        dynamicTerm = {
          name: 'Term Test',
        };
      });

      it('should not create term if term name is not provided', (done) => {
        delete dynamicTerm.name;
        request.send(dynamicTerm).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have.property('errors').to.include('Name is required');
          done();
        });
      });
      it('should not create term if term name is empty', (done) => {
        dynamicTerm.name = '';
        request.send(dynamicTerm).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Name cannot be empty');
          done();
        });
      });
      it('should not create term if term name is not string', (done) => {
        dynamicTerm.name = 2;
        request.send(dynamicTerm).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Name must be a string');
          done();
        });
      });
    });
    describe('TERM INEXISTENCE', () => {
      beforeEach((done) => {
        Term.create(term, (err) => {
          if (!err) done();
        });
      });
      it('should send back 409 status with error if term exists', (done) => {
        chai
          .request(app)
          .post(baseUrl)
          .set('token', adminToken)
          .send(term)
          .end((err, res) => {
            res.status.should.equals(409);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('term already exists');
            done();
          });
      });
    });
  });

  describe(`/PUT ${baseUrl}/:id`, () => {
    let termId;
    beforeEach(async () => {
      await Term.deleteMany();
      const createdTerm = await Term.create(term);
      termId = createdTerm._id;
    });
    afterEach((done) => {
      Term.deleteMany((err) => {
        if (!err) done();
      });
    });
    describe('SUCCESS', () => {
      beforeEach(async () => {
        await Term.deleteMany();
        const createdTerm = await Term.create(term);
        termId = createdTerm._id;
      });
      afterEach((done) => {
        Term.deleteMany((err) => {
          if (!err) done();
        });
      });

      it('should edit term if request is valid and user is admin', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${termId}`)
          .set('token', adminToken)
          .send(termUpdate)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have
              .property('message')
              .to.equals('term updated successfully');
            done();
          });
      });
      it('should edit term if request is valid and user is moderator', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${termId}`)
          .set('token', moderatorToken)
          .send(termUpdate)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.data.should.have
              .property('message')
              .to.equals('term updated successfully');
            done();
          });
      });
    });

    describe('FAKE INTERNAL SERVER ERROR', () => {
      let stub;
      before(() => {
        stub = sinon.stub(Response, 'Success').throws(new Error('error'));
      });
      after(() => {
        stub.restore();
      });
      it('returns status of 500', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${termId}`)
          .set('token', adminToken)
          .send(termUpdate)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Could not update term');
            done();
          });
      });
    });

    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${termId}`)
          .send(termUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${termId}`)
          .set('token', invalidToken)
          .send(termUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('ADMIN ACCESS', () => {
      it('should return 401 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${termId}`)
          .set('token', staffToken)
          .send(termUpdate)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('INPUT VALIDATION', () => {
      let dynamicTerm;
      let request;
      beforeEach(() => {
        dynamicTerm = {};
        request = chai
          .request(app)
          .put(`${baseUrl}/${termId}`)
          .set('token', adminToken);
      });
      it('should not edit term if term name is empty', (done) => {
        dynamicTerm.name = '';
        request.send(dynamicTerm).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Name cannot be empty');
          done();
        });
      });
      it('should not edit term if term name is not string', (done) => {
        dynamicTerm.name = 2;
        request.send(dynamicTerm).end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.equals('error');
          res.body.should.have
            .property('errors')
            .to.include('Name must be a string');
          done();
        });
      });
    });
    describe('TERM EXISTENCE', () => {
      beforeEach((done) => {
        Term.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should send back 404 status with error if term does not exist', (done) => {
        chai
          .request(app)
          .put(`${baseUrl}/${termId}`)
          .set('token', adminToken)
          .send(termUpdate)
          .end((err, res) => {
            res.status.should.equals(404);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('term does not exist');
            done();
          });
      });
    });
  });

  describe(`/DELETE ${baseUrl}/:id`, () => {
    let termId;
    beforeEach(async () => {
      await Term.deleteMany();
      const createdTerm = await Term.create(term);
      termId = createdTerm._id;
    });
    afterEach((done) => {
      Term.deleteMany((err) => {
        if (!err) done();
      });
    });
    describe('SUCCESSFUL DELETE', () => {
      beforeEach(async () => {
        await Term.deleteMany();
        const createdTerm = await Term.create(term);
        termId = createdTerm._id;
      });
      afterEach((done) => {
        Term.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should delete term if data is valid and user is admin', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${termId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('status').to.equals('success');
            res.body.should.have.property('data');
            res.body.data.should.have
              .property('message')
              .to.equals('Term deleted successfully');
            done();
          });
      });
    });
    describe('FAKE INTERNAL SERVER ERROR', () => {
      let stub;
      before(() => {
        stub = sinon.stub(Response, 'Success').throws(new Error('error'));
      });
      after(() => {
        stub.restore();
      });
      it('returns status of 500', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${termId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.have
              .property('error')
              .to.equals('Error deleting term');
            done();
          });
      });
    });
    describe('TOKEN VALIDATION', () => {
      it('should return 401 with error message if no token is provided', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${termId}`)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
      it('should return 401 status with error message if an invalid token is provided', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${termId}`)
          .set('token', invalidToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });

    describe('ADMIN ACCESS', () => {
      it('should return 401 with error if user is not moderator or admin', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${termId}`)
          .set('token', staffToken)
          .end((err, res) => {
            res.should.have.status(401);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('Not authorized to access data');
            done();
          });
      });
    });
    describe('TERM EXISTENCE', () => {
      beforeEach((done) => {
        Term.deleteMany((err) => {
          if (!err) done();
        });
      });
      it('should send back 404 status with error if Term does not exist', (done) => {
        chai
          .request(app)
          .delete(`${baseUrl}/${termId}`)
          .set('token', adminToken)
          .end((err, res) => {
            res.status.should.equals(404);
            res.body.should.have.property('status').to.equals('error');
            res.body.should.have
              .property('error')
              .to.equals('term does not exist');
            done();
          });
      });
    });
  });
});