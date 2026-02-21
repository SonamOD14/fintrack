const request = require('supertest');
require ('dotenv').config();
const BASE_URL = 'http://localhost:3000'; // change if needed

describe('register Tests', () => {
  it('should create a new user', async () => {
    const uniqueUsername = `testuser${Date.now()}`;
    const uniqueEmail = `unique${Date.now()}@gmail.com`;

    const res = await request(BASE_URL)
      .post('/api/user/register')
      .send({
        username: uniqueUsername,
        email: uniqueEmail,
        password: 'securepassword123',
      });

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User added successfully');
    expect(res.body.user.email).toBe(uniqueEmail);
  });
});