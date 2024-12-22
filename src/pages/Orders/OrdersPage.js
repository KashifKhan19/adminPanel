import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersPage.css';
import { FaPlus } from 'react-icons/fa';
import OrderCard from './OrderCard';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/dashboard/all-orders');
                if (response.data.success) {
                    setOrders(response.data.orders);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    const handleEdit = (order) => {
        setCurrentOrder(order);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentOrder({
            userId: '',
            items: [{ productId: '', quantity: 1, price: 0 }],
            totalAmount: 0,
            paymentMethod: 'CARD',
            isPaid: false,
            paidAt: '',
            isDelivered: false,
            deliveredAt: '',
            shippingAddress: {
                address: '',
                city: '',
                province: '',
                postalCode: '',
                country: 'Pakistan',
            },
            contactNumber: '',
        });
        setIsCreating(true);
    };

    const handleSave = async () => {
        if (isCreating) {
            try {
                const response = await axios.post('http://localhost:4000/api/dashboard/create-order', currentOrder);
                if (response.data.success) {
                    setOrders([...orders, response.data.order]);
                    setIsCreating(false);
                }
            } catch (error) {
                console.error('Error creating order:', error);
            }
        } else {
            try {
                const response = await axios.put(`http://localhost:4000/api/dashboard/update-order/${currentOrder._id}`, currentOrder);
                if (response.data.success) {
                    setOrders(orders.map(order => (order._id === currentOrder._id ? response.data.order : order)));
                    setIsEditing(false);
                }
            } catch (error) {
                console.error('Error updating order:', error);
            }
        }
        setCurrentOrder(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentOrder({
            ...currentOrder,
            [name]: value
        });
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const items = [...currentOrder.items];
        items[index] = { ...items[index], [name]: value };
        setCurrentOrder({ ...currentOrder, items });
    };

    const addItem = () => {
        setCurrentOrder({
            ...currentOrder,
            items: [...currentOrder.items, { productId: '', quantity: 1, price: 0 }]
        });
    };

    const removeItem = (index) => {
        const items = currentOrder.items.filter((_, idx) => idx !== index);
        setCurrentOrder({ ...currentOrder, items });
    };

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'paid') return order.isPaid;
        if (filter === 'notPaid') return !order.isPaid;
        if (filter === 'delivered') return order.isDelivered;
        if (filter === 'notDelivered') return !order.isDelivered;
        return true;
    });

    return (
        <div className="order-page">
            <h2>Orders</h2>
            <div className="actions">
                <button className="create-button" onClick={handleCreate}>
                    <FaPlus /> Create New Order
                </button>
                <div className="filter">
                    <label>Filter by:</label>
                    <select value={filter} onChange={handleFilterChange}>
                        <option value="all">All</option>
                        <option value="paid">Paid</option>
                        <option value="notPaid">Not Paid</option>
                        <option value="delivered">Delivered</option>
                        <option value="notDelivered">Not Delivered</option>
                    </select>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Items</th>
                        <th>Ordered Date</th>
                        <th>Total Amount</th>
                        <th>Payment Method</th>
                        <th>Is Paid</th>
                        <th>Paid At</th>
                        <th>Is Delivered</th>
                        <th>Delivered At</th>
                        <th>Address</th>
                        <th>Contact Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order, index) => (
                        <OrderCard key={index} order={order} onEdit={handleEdit} />
                    ))}
                </tbody>
            </table>

            {(isEditing || isCreating) && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{isCreating ? 'Create New Order' : 'Edit Order'}</h2>
                        <label>
                            User ID:
                            <input type="text" name="userId" value={currentOrder.userId} onChange={handleChange} />
                        </label>
                        <label>
                            Items:
                            {currentOrder.items.map((item, index) => (
                                <div key={index} className="item-fields">
                                    <label>
                                        Product ID:
                                        <input type="text" name="productId" placeholder="Product ID" value={item.productId} onChange={(e) => handleItemChange(index, e)} />
                                    </label>
                                    <label>
                                        Quantity:
                                        <input type="number" name="quantity" placeholder="Quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
                                    </label>
                                    <label>
                                        Price:
                                        <input type="number" name="price" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, e)} />
                                    </label>
                                    <button onClick={() => removeItem(index)}>Remove</button>
                                </div>
                            ))}
                            <button onClick={addItem}>Add Item</button>
                        </label>
                        <label>
                            Total Amount:
                            <input type="number" name="totalAmount" value={currentOrder.totalAmount} onChange={handleChange} />
                        </label>
                        <label>
                            Payment Method:
                            <select name="paymentMethod" value={currentOrder.paymentMethod} onChange={handleChange}>
                                <option value="CARD">CARD</option>
                                <option value="COD">COD</option>
                            </select>
                        </label>
                        <label>
                            Is Paid:
                            <input type="checkbox" name="isPaid" checked={currentOrder.isPaid} onChange={() => setCurrentOrder({ ...currentOrder, isPaid: !currentOrder.isPaid })} />
                        </label>
                        <label>
                            Paid At:
                            <input type="datetime-local" name="paidAt" value={currentOrder.paidAt} onChange={handleChange} />
                        </label>
                        <label>
                            Is Delivered:
                            <input type="checkbox" name="isDelivered" checked={currentOrder.isDelivered} onChange={() => setCurrentOrder({ ...currentOrder, isDelivered: !currentOrder.isDelivered })} />
                        </label>
                        <label>
                            Delivered At:
                            <input type="datetime-local" name="deliveredAt" value={currentOrder.deliveredAt} onChange={handleChange} />
                        </label>
                        <label>
                            Shipping Address:
                            <input type="text" name="shippingAddress" value={currentOrder.shippingAddress.address} onChange={handleChange} />
                        </label>
                        <label>
                            City:
                            <input type="text" name="city" value={currentOrder.shippingAddress.city} onChange={handleChange} />
                        </label>
                        <label>
                            Province:
                            <input type="text" name="province" value={currentOrder.shippingAddress.province} onChange={handleChange} />
                        </label>
                        <label>
                            Postal Code:
                            <input type="text" name="postalCode" value={currentOrder.shippingAddress.postalCode} onChange={handleChange} />
                        </label>
                        <label>
                            Country:
                            <input type="text" name="country" value={currentOrder.shippingAddress.country} onChange={handleChange} />
                        </label>
                        <label>
                            Contact Number:
                            <input type="text" name="contactNumber" value={currentOrder.contactNumber} onChange={handleChange} />
                        </label>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={() => { setIsEditing(false); setIsCreating(false); setCurrentOrder(null); }}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderPage;
