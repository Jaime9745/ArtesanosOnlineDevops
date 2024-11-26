//import { listFood } from '../controllers/foodController.js';
//import foodModel from '../models/foodModel.js';

const { listFood } = require('../controllers/foodController');
const foodModel = require('../models/foodModel');

// Mock de foodModel
jest.mock('../models/foodModel.js', () => ({
  find: jest.fn(),
}));

describe('listFood Controller', () => {
  it('debería devolver la lista de alimentos', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
    };

    foodModel.find.mockResolvedValue([
      { name: 'Pizza', price: 10 },
      { name: 'Burger', price: 5 },
    ]);

    await listFood(req, res);

    expect(foodModel.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [
        { name: 'Pizza', price: 10 },
        { name: 'Burger', price: 5 },
      ],
    });
  });
});
