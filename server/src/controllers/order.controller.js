const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { Order, Gig } = require('../models');
const { CustomException } = require('../utils');

// Get all orders for the current user
const getOrders = async (request, response) => {
    try {
        // Check if user is authenticated
        if (!request.userID) {
            return response.status(401).send({
                error: true,
                message: 'You are not authenticated!'
            });
        }

        // Build query to find orders where user is either seller or buyer
        const query = { 
            $and: [
                { $or: [{ sellerID: request.userID }, { buyerID: request.userID }] },
                { isCompleted: true }
            ] 
        };
        
        // Get orders with populated user data
        const orders = await Order.find(query)
            .populate(request.isSeller ? 'buyerID' : 'sellerID', 'username email image country')
            .sort({ createdAt: -1 });

        return response.status(200).send(orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        return response.status(500).send({
            error: true,
            message: error.message || 'Error fetching orders'
        });
    }
};

const paymentIntent = async (request, response) => {
    const { _id } = request.params;

    try {
        const gig = await Gig.findOne({ _id });
        if (!gig) {
            return response.status(404).send({
                error: true,
                message: 'Gig not found'
            });
        }

        // Ensure minimum amount for Stripe (50 cents)
        const amountInCents = Math.max(gig.price * 100, 50);

        // Create payment intent with proper error handling
        try {
            const payment_intent = await stripe.paymentIntents.create({
                amount: amountInCents,
                currency: "INR",
                automatic_payment_methods: {
                    enabled: true,
                },
                metadata: {
                    gigId: gig._id.toString(),
                    userId: request.userID
                }
            });

            const order = new Order({
                gigID: gig._id,
                image: gig.cover,
                title: gig.title,
                buyerID: request.userID,
                sellerID: gig.userID,
                price: gig.price,
                payment_intent: payment_intent.id
            });

            await order.save();
            return response.send({
                error: false,
                clientSecret: payment_intent.client_secret
            });
        } catch (stripeError) {
            console.error('Stripe error:', stripeError);
            return response.status(400).send({
                error: true,
                message: stripeError.message || 'Error creating payment intent'
            });
        }
    } catch (error) {
        console.error('Error in payment intent controller:', error);
        return response.status(500).send({
            error: true,
            message: error.message || 'Internal server error'
        });
    }
};

const updatePaymentStatus = async (request, response) => {
    const { payment_intent } = request.body;

    try {
        const order = await Order.findOneAndUpdate({ payment_intent }, {
            $set: {
                isCompleted: true
            }
        }, { new: true });

        if (order?.isCompleted) {
            return response.status(202).send({
                error: false,
                message: 'Order has been confirmed!'
            });
        }

        throw CustomException('Payment status not updated!', 500);
    }
    catch ({ message, status = 500 }) {
        return response.status(status).send({
            error: true,
            message
        });
    }
};

module.exports = {
    getOrders,
    paymentIntent,
    updatePaymentStatus
};

