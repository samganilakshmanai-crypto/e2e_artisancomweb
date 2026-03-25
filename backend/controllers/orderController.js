import Order from '../models/Order.js';

import sendOrderConfirmationEmail from '../utils/sendEmail.js';

export const addOrderItems = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, totalAmount, paymentScreenshot } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        } else {
            const order = new Order({
                customerId: req.user._id,
                items: orderItems,
                shippingAddress,
                paymentMethod,
                totalAmount,
                paymentScreenshot
            });

            const createdOrder = await order.save();
            
            // Trigger Email asynchronously
            sendOrderConfirmationEmail(shippingAddress.email || req.user.email, createdOrder._id.toString());
            
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customerId', 'name email')
            .populate('items.artisanId', 'name email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getArtisanOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'items.artisanId': req.user._id }).populate('customerId', 'name email');
        
        const artisanOrders = orders.map(order => {
            const filteredItems = order.items.filter(item => item.artisanId.toString() === req.user._id.toString());
            return {
                ...order._doc,
                items: filteredItems,
            };
        });

        res.json(artisanOrders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addOrderFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.feedback = feedback;
            await order.save();
            res.json({ message: 'Feedback added successfully', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addOrderIssue = async (req, res) => {
    try {
        const { issue } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.issue = issue;
            await order.save();
            res.json({ message: 'Issue reported successfully', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('customerId', 'name email').populate('items.artisanId', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('customerId', 'name email').populate('items.artisanId', 'name email');

        if (order) {
            res.json({ message: 'Order status updated successfully', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
