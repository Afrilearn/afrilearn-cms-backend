# afrilearn-cms-backend
Content Management System for Afrilearn

[![](https://img.shields.io/badge/Protected_by-Hound-a873d1.svg)](https://houndci.com)  [![Build Status](https://travis-ci.com/Afrilearn/afrilearn-cms-backend.svg?branch=develop)](https://travis-ci.com/Afrilearn/afrilearn-cms-backend)  [![Coverage Status](https://coveralls.io/repos/github/Afrilearn/afrilearn-cms-backend/badge.svg?branch=develop)](https://coveralls.io/github/Afrilearn/afrilearn-cms-backend?branch=develop)


## Required Features

- Admin profile can create user accounts on the CMS platform
- Admin profile can edit user accounts on the CMS platform
- Admin profile can change user password of other accounts
- and others


## Technologies

- Node JS
- Express
- Mocha & Chai
- ESLint
- ESM
- Travis CI
- Coveralls


## Requirements and Installation

To install and run this project you would need to have installed:
- Node Js
- Git

To run:
```
$ git clone https://github.com/Afrilearn/afrilearn-backend.git
$ cd afrilearn-backend
$ npm install
$ npm run dev
```

## Testing
```
$ npm test
```

## Pivotal Tracker stories

None

## Template UI

None

## API

The API is currently in version 1 (v1) and can be accessed locally via [http://localhost:5000/api/v1](http://localhost:5000/api/vi)  

## API Documentation Link

The API documentation is at [https://docs.google.com/document/d/1Tes9AxwrQ3X-Fc8z6rz00qzBfD0xplW9BPzlKIROqZc/edit](https://docs.google.com/document/d/1Tes9AxwrQ3X-Fc8z6rz00qzBfD0xplW9BPzlKIROqZc/edit)

## API Endpoints

| Endpoint                                         | Functionality                            |
| ------------------------------------------------ | -----------------------------------------|
| POST /baseURL/auth/signup           | Create a user                           |
| GET /baseURL/users/cms   | Get users on CMS                           |
| POST /baseURL/auth/login   | Login a user                            |

                       |
    

## Author

Okwuosa Chijioke (Okwuosachijioke@gmail.com)

## License

This is licensed for your use, modification and distribution under the [MIT license.](https://opensource.org/licenses/MIT)

## My Env Variables
NODE_ENV
PORT
ATLAS_URL
SECRET

