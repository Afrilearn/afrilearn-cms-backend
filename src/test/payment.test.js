import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';

import app from '../index';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let token;

// let's set up the data we need to pass to the login method
const userCredentials = {
  email: 'david@yahoo.com',
  password: 'garyTheSnail',
};
// now let's login the user and get a token before we run any tests
before((done) => {
  chai
    .request(app)
    .post('/login')
    .send(userCredentials)
    .end((err, res) => {
      res.should.have.status(200);
      token = res.body.token;
      done();
    });
});

describe('PAYMENT Endpoint', () => {
  describe('GET/api/v1/plan/payment-plan', () => {
    it('should return array of payment plans', (done) => {
      chai
        .request(app)
        .set('Authorization', `Bearer ${token}`)
        .get('/api/v1/plan/payment-plan')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });
  describe('GET/api/v1/plan/payment-transactions', () => {
    it('should return array of all transactions on the platform', (done) => {
      chai
        .request(app)
        .set('Authorization', `Bearer ${token}`)
        .get('/api/v1/plan/payment-transactions')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });
  describe('GET/api/v1/plan/add-payment-plan', () => {
    it('should create a new payment plan', (done) => {
      const body = {
        name: '',
        amount: '',
        duration: '',
        category: '',
      };
      chai
        .request(app)
        .set('Authorization', `Bearer ${token}`)
        .post('/api/v1/plan/add-payment-plan')
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });
  describe('GET/api/v1/plan/edit-payment-plan', () => {
    it('should edit existing payment plan', (done) => {
      const _id = 'hhjhj893hsbcbjsvj43';
      const body = {
        name: '',
        amount: '',
        duration: '',
        category: '',
      };
      chai
        .request(app)
        .set('Authorization', `Bearer ${token}`)
        .put(`/api/v1/plan/edit-payment-plan ${_id}`)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });
  describe('GET/api/v1/plan/remove-payment-plan', () => {
    it('should remove a payment plan from the data base', (done) => {
      const _id = '6hy8gjh8eghhjwhjhjjw';
      chai
        .request(app)
        .delete(`/api/v1/plan/remove-payment-plan/${_id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(body)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('data');
          res.body.data.should.be.a('array');
          done();
        });
    });
  });
});
