const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const { createOrder, updateOrder, getOrders, deleteOrder } = require('../controllers/orderController');
const { expect } = chai;

describe('Order Controller - createOrder', () => {
  it('should create a new order successfully', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { restaurantId: 'mockRestId', items: [{ name: 'Pizza', qty: 1 }], address: '123 Street' }
    };
    const createdOrder = { _id: new mongoose.Types.ObjectId(), ...req.body, customerId: req.user.id };
    const createStub = sinon.stub(Order, 'create').resolves(createdOrder);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createOrder(req, res);
    expect(createStub.calledOnceWith({ customerId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdOrder)).to.be.true;
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { restaurantId: 'mockRestId', items: [{ name: 'Pizza', qty: 1 }], address: '123 Street' }
    };
    const createStub = sinon.stub(Order, 'create').throws(new Error('DB Error'));
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await createOrder(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    createStub.restore();
  });
});

describe('Order Controller - updateOrder', () => {
  it('should update order successfully', async () => {
    const orderId = new mongoose.Types.ObjectId();
    const existingOrder = {
      _id: orderId,
      restaurantId: 'oldId',
      status: 'Pending',
      save: sinon.stub().resolvesThis()
    };
    const findByIdStub = sinon.stub(Order, 'findById').resolves(existingOrder);
    const req = { params: { id: orderId }, body: { status: 'Delivered' } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    await updateOrder(req, res);
    expect(existingOrder.status).to.equal('Delivered');
    expect(res.json.calledOnce).to.be.true;
    findByIdStub.restore();
  });

  it('should return 404 if order not found', async () => {
    const findByIdStub = sinon.stub(Order, 'findById').resolves(null);
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateOrder(req, res);
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Order not found' })).to.be.true;
    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Order, 'findById').throws(new Error('DB Error'));
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await updateOrder(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    findByIdStub.restore();
  });
});

describe('Order Controller - getOrders', () => {
  it('should return orders for the user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const orders = [{ _id: new mongoose.Types.ObjectId(), restaurantId: 'mockId', customerId: userId }];
    const findStub = sinon.stub(Order, 'find').resolves(orders);
    const req = { user: { id: userId } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    await getOrders(req, res);
    expect(findStub.calledOnceWith({ customerId: userId })).to.be.true;
    expect(res.json.calledWith(orders)).to.be.true;
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    const findStub = sinon.stub(Order, 'find').throws(new Error('DB Error'));
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };
    await getOrders(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    findStub.restore();
  });
});

describe('Order Controller - deleteOrder', () => {
  it('should delete order successfully', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const order = { remove: sinon.stub().resolves() };
    const findByIdStub = sinon.stub(Order, 'findById').resolves(order);
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteOrder(req, res);
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(order.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Order deleted' })).to.be.true;
    findByIdStub.restore();
  });

  it('should return 404 if order not found', async () => {
    const findByIdStub = sinon.stub(Order, 'findById').resolves(null);
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteOrder(req, res);
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Order not found' })).to.be.true;
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    const findByIdStub = sinon.stub(Order, 'findById').throws(new Error('DB Error'));
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };
    await deleteOrder(req, res);
    expect(res.status.calledWith(500)).to.be.true;
    findByIdStub.restore();
  });
});