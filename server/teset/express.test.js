const request = require('supertest');
const app = require('../server'); // Adjust the path to your server.js file

describe('Express Server', () => {
  let server;

  // Start the server before all tests
  beforeAll((done) => {
    server = app.listen(8000, () => {
      console.log('Test server is running on port 8000');
      done();
    });
  });

  // Close the server after all tests
  afterAll((done) => {
    server.close(() => {
      console.log('Test server stopped');
      done();
    });
  });

  it('should respond with status 200 for a valid route', async () => {
    const response = await request(server).get('/'); // Ensure `/` is a valid route
    expect(response.status).toBe(200);
  }, 10000); // Increase timeout if needed
});
