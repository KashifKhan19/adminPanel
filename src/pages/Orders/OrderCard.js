import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';

const OrderCard = ({ order, onEdit }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => setShowTooltip(true);
    const handleMouseLeave = () => setShowTooltip(false);

    return (
        <tr>
            {/* Hoverable cell for User Info */}
            <td
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="hover-info"
            >
                <span>
                    {order.userInfo.name ? `User: ${order.userInfo.name}` : `Guest`}
                </span>
                {showTooltip && (
                    <div className="tooltip">
                        <p>Name: {order.userInfo.name || 'Guest'}</p>
                        <p>Email: {order.userInfo.email}</p>
                    </div>
                )}
            </td>

            <td>
                <ul>
                    {order.items.map((item, idx) => (
                        <li key={idx}>{item.productName} - Quantity: {item.quantity}</li>
                    ))}
                </ul>
            </td>
            <td>{new Date(order.orderedDate).toLocaleString()}</td>
            <td>Rs: {order.totalAmount.toFixed(2)}</td>
            <td>{order.paymentMethod}</td>
            <td>{order.isPaid ? 'Yes' : 'No'}</td>
            <td>{order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}</td>
            <td>{order.isDelivered ? 'Yes' : 'No'}</td>
            <td>{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : 'N/A'}</td>
            <td>
                <div>{order.shippingAddress.address}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.province}, {order.shippingAddress.postalCode}</div>
                <div>{order.shippingAddress.country}</div>
            </td>
            <td>{order.contactNumber}</td>
            <td>
                <FaEdit className="action-icon" onClick={() => onEdit(order)} />
            </td>
        </tr>
    );
};

export default OrderCard;
