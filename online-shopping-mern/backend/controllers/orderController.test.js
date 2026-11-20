const assert = require('node:assert/strict');
const { afterEach, test } = require('node:test');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { createOrder } = require('./orderController');

const originalFind = Product.find;
const originalUpdateOne = Product.updateOne;
const originalCreate = Order.create;

const productAId = '507f1f77bcf86cd799439011';
const productBId = '507f1f77bcf86cd799439012';

afterEach(() => {
  Product.find = originalFind;
  Product.updateOne = originalUpdateOne;
  Order.create = originalCreate;
});

const setUpStore = (products, createOrder = async (order) => ({ _id: 'order-test', ...order })) => {
  Product.find = async () => products;
  Product.updateOne = async (filter, update) => {
    const product = products.find((item) => String(item._id) === String(filter._id));
    if (!product) return { matchedCount: 0 };
    if (filter.stock && product.stock < filter.stock.$gte) return { matchedCount: 0 };

    product.stock += update.$inc.stock;
    return { matchedCount: 1 };
  };
  Order.create = createOrder;
};

const makeProduct = (id, stock) => ({
  _id: id,
  name: `Product ${id.slice(-1)}`,
  image: 'image-url',
  price: 10,
  stock,
});

const submitOrder = async (items) => {
  let response;
  let error;
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      response = data;
    },
  };

  await createOrder(
    { body: { items, shippingAddress: {} }, user: { _id: 'customer-test' } },
    res,
    (nextError) => {
      error = nextError;
    }
  );
  return { res, response, error };
};

test('aggregates duplicate product lines before reserving stock', async () => {
  const product = makeProduct(productAId, 5);
  setUpStore([product]);

  const { res, response } = await submitOrder([
    { product: productAId.toUpperCase(), quantity: 2 },
    { product: productAId, quantity: 2 },
  ]);

  assert.equal(res.statusCode, 201);
  assert.equal(product.stock, 1);
  assert.equal(response.items.length, 1);
  assert.equal(response.items[0].quantity, 4);
  assert.equal(response.totalPrice, 40);
});

test('rejects duplicate quantities above stock without decrementing inventory', async () => {
  const product = makeProduct(productAId, 5);
  let orderCreated = false;
  setUpStore([product], async (order) => {
    orderCreated = true;
    return order;
  });

  const { res } = await submitOrder([
    { product: productAId, quantity: 3 },
    { product: productAId, quantity: 3 },
  ]);

  assert.equal(res.statusCode, 400);
  assert.equal(product.stock, 5);
  assert.equal(orderCreated, false);
});

test('restores earlier reservations when a later product has insufficient stock', async () => {
  const firstProduct = makeProduct(productAId, 4);
  const secondProduct = makeProduct(productBId, 1);
  let orderCreated = false;
  setUpStore([firstProduct, secondProduct], async (order) => {
    orderCreated = true;
    return order;
  });

  const { res } = await submitOrder([
    { product: productAId, quantity: 2 },
    { product: productBId, quantity: 2 },
  ]);

  assert.equal(res.statusCode, 400);
  assert.equal(firstProduct.stock, 4);
  assert.equal(secondProduct.stock, 1);
  assert.equal(orderCreated, false);
});

test('restores reserved stock when order persistence fails', async () => {
  const product = makeProduct(productAId, 4);
  setUpStore([product], async () => {
    throw new Error('simulated order write failure');
  });

  const { error } = await submitOrder([{ product: productAId, quantity: 2 }]);

  assert.match(error.message, /simulated order write failure/);
  assert.equal(product.stock, 4);
});
