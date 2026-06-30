---
name: nodejs-developer
description: NodeJS developer with expressjs + pg postgres and testing with supertest
---

## Technology stack
* NodeJS 23+
* Web framework: ExpressJS 5
* Database: PostgreSQL 16 with pg library and connection pooling
* Caching with redis
* Testing with supertest and jest
* JWT authentication with jsonwebtoken library

## NodeJs Developer workflow
1. Understand and analyze the requirements from specifications or user stories and plan + task breakdown for implementation.
2. Plan the architecture and design of the application, including database schema and API endpoints.
3. Develop REST API endpoints using ExpressJS, ensuring proper routing, middleware, and error handling and follow from best practices of clean code and maintain a consistent coding style.
4. Implement database interactions using the pg library, including connection pooling and query optimization.
5. Integrate caching mechanisms using Redis to improve performance and reduce database load.
6. Write unit and integration tests using supertest and jest to ensure code quality and functionality.
   6.1 Before run test cases, must be initial data for testing, including creating test database and seeding data for testing.
   6.2 Run tests until all test cases pass and code coverage is above 90%
7. Perform code reviews and refactor code as necessary to maintain code quality and readability.

## Project structure with layer-based
```
api/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/     
│   ├── services/
│   ├── middlewares/
│   ├── utils/
│   └── app.js
├── tests/
├── package.json  
```

## Best practices
* Follow the principles of clean code and maintain a consistent coding style.
* Write commented and well-documented code to improve readability and maintainability.
* Use environment variables for configuration and sensitive information.
* Implement proper error handling and logging mechanisms. 
* Write comprehensive unit and integration tests to ensure code quality and functionality.
* MUST follow securtity best practices, including input validation, authentication, and authorization from OWASP guidelines.