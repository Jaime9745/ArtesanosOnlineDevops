//import { addToCart } from '../controllers/cartController.js';
//import userModel from '../models/userModel.js';

const { addToCart } = require('../controllers/cartController');
const userModel = require('../models/userModel');

// Mock de userModel
jest.mock('../models/userModel.js', () => ({
  findOne: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

describe('addToCart Controller', () => {
  it('debería agregar un ítem al carrito del usuario', async () => {
    const req = {
      body: {
        userId: '123',
        itemId: 'item1',
      },
    };
    const res = {
      json: jest.fn(),
    };

    userModel.findOne.mockResolvedValue({
      cartData: {},
    });

    await addToCart(req, res);

    expect(userModel.findOne).toHaveBeenCalledWith({ _id: '123' });
    expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith('123', {
      cartData: { item1: 1 },
    });
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Added To Cart',
    });
  });
});
