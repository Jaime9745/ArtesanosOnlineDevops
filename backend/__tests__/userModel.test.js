//import userModel from '../models/userModel.js';

const userModel = require('../models/userModel');

describe('userModel Schema', () => {
  it('debería crear un usuario válido', () => {
    const user = new userModel({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securepassword123',
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.password).toBe('securepassword123');
    expect(user.cartData).toEqual({});
  });
});
