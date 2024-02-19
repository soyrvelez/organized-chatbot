import fetch from 'node-fetch';

const BASE_URL = 'https://organized-chatbot.vercel.app/api'; // Adjust according to your local or test server

describe('User CRUD Operations', () => {
  let createdUserId: string;

  it('should create a new user (POST)', async () => {
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 'newUserId',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    createdUserId = data.id;
    expect(data.id).toBeDefined();
  });

  it('should retrieve a user (GET)', async () => {
    const response = await fetch(`${BASE_URL}/user?id=${createdUserId}`);
    expect(response.status).toBe(200);
    const user = await response.json();
    expect(user.id).toBe(createdUserId);
  });

  it('should update a user (PUT)', async () => {
    const newId = 'updatedUserId';
    const response = await fetch(`${BASE_URL}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentId: createdUserId,
        newId: newId,
      }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBe(newId);
    createdUserId = newId; // Update for further tests or cleanup
  });

  it('should delete a user (DELETE)', async () => {
    const response = await fetch(`${BASE_URL}/user?id=${createdUserId}`, {
      method: 'DELETE',
    });

    expect(response.status).toBe(200);
  });
});
