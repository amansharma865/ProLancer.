// const { Order, Gig } = require('../models');
// const { CustomException } = require('../utils');
// const stripe = require('stripe')(process.env.STRIPE_SECRET);

// const getOrders = async (request, response) => {
//     try {
//         const orders = await Order.find({ $and: [{ $or: [{ sellerID: request.userID }, { buyerID: request.userID }] }, { isCompleted: true }] }).populate(request.isSeller? 'buyerID' : 'sellerID', 'username email image country');
//         return response.send(orders);
//     }
//     catch ({ message, status = 500 }) {
//         return response.send({
//             error: true,
//             message
//         })
//     }
// }

// const paymentIntent = async (request, response) => {
//     const { _id } = request.params;

//     try {
//         const gig = await Gig.findOne({ _id });

//         const payment_intent = await stripe.paymentIntents.create({
//             amount: gig.price * 100,
//             currency: "INR",
//             automatic_payment_methods: {
//                 enabled: true,
//             },
//         });

//         const order = new Order({
//             gigID: gig._id,
//             image: gig.cover,
//             title: gig.title,
//             buyerID: request.userID,
//             sellerID: gig.userID,
//             price: gig.price,
//             payment_intent: payment_intent.id
//         });

//         await order.save();
//         return response.send({
//             error: false,
//             clientSecret: payment_intent.client_secret
//         })

//     }
//     catch({message, status = 500}) {
//         return response.send({
//             error: true,
//             message
//         })
//     }
// }

// const updatePaymentStatus = async (request, response) => {
//     const { payment_intent } = request.body;

//     try {
//         const order = await Order.findOneAndUpdate({ payment_intent }, {
//             $set: {
//                 isCompleted: true
//             }
//         }, { new: true });

//         if(order?.isCompleted) {
//             return response.status(202).send({
//                 error: false,
//                 message: 'Order has been confirmed!'
//             })
//         }

//         throw CustomException('Payment status not updated!', 500);
//     }
//     catch({message, status = 500}) {
//         return response.status(status).send({
//             error: true,
//             message
//         })
//     }
// }

// module.exports = {
//     getOrders,
//     paymentIntent,
//     updatePaymentStatus
// }


// const { Order, Gig } = require('../models');
// const { CustomException } = require('../utils');
// const stripe = require('stripe')(process.env.STRIPE_SECRET);

// const getOrders = async (request, response) => {
//     try {
//         const orders = await Order.find({ $and: [{ $or: [{ sellerID: request.userID }, { buyerID: request.userID }] }, { isCompleted: true }] }).populate(request.isSeller ? 'buyerID' : 'sellerID', 'username email image country');
//         return response.send(orders);
//     }
//     catch ({ message, status = 500 }) {
//         return response.send({
//             error: true,
//             message
//         });
//     }
// };

// // const paymentIntent = async (request, response) => {
// //     const { _id } = request.params;

// //     try {
// //         const gig = await Gig.findOne({ _id });
// //         if (!gig) {
// //             throw CustomException('Gig not found', 404);
// //         }

// //         const payment_intent = await stripe.paymentIntents.create({
// //             amount: gig.price * 100,
// //             currency: "INR",
// //             automatic_payment_methods: {
// //                 enabled: true,
// //             },
// //         });

// //         const order = new Order({
// //             gigID: gig._id,
// //             image: gig.cover,
// //             title: gig.title,
// //             buyerID: request.userID,
// //             sellerID: gig.userID,
// //             price: gig.price,
// //             payment_intent: payment_intent.id
// //         });

// //         await order.save();
// //         return response.send({
// //             error: false,
// //             clientSecret: payment_intent.client_secret
// //         });

// //     } catch ({ message, status = 500 }) {
// //         console.error('Error creating payment intent:', message); // Log the error
// //         return response.status(status).send({
// //             error: true,
// //             message
// //         });
// //     }
// // };


// const paymentIntent = async (request, response) => {
//     const { _id } = request.params;

//     try {
//         const gig = await Gig.findOne({ _id });
//         if (!gig) {
//             throw new Error('Gig not found');
//         }

//         const payment_intent = await stripe.paymentIntents.create({
//             amount: gig.price * 100,
//             currency: "INR",
//             automatic_payment_methods: {
//                 enabled: true,
//             },
//         });

//         const order = new Order({
//             gigID: gig._id,
//             image: gig.cover,
//             title: gig.title,
//             buyerID: request.userID,
//             sellerID: gig.userID,
//             price: gig.price,
//             payment_intent: payment_intent.id
//         });

//         await order.save();
//         return response.send({
//             error: false,
//             clientSecret: payment_intent.client_secret
//         });

//     } catch (error) {
//         console.error('Error creating payment intent:', error); // Log the error
//         return response.status(500).send({
//             error: true,
//             message: error.message
//         });
//     }
// };

// const updatePaymentStatus = async (request, response) => {
//     const { payment_intent } = request.body;

//     try {
//         const order = await Order.findOneAndUpdate({ payment_intent }, {
//             $set: {
//                 isCompleted: true
//             }
//         }, { new: true });

//         if (order?.isCompleted) {
//             return response.status(202).send({
//                 error: false,
//                 message: 'Order has been confirmed!'
//             });
//         }

//         throw CustomException('Payment status not updated!', 500);
//     }
//     catch ({ message, status = 500 }) {
//         return response.status(status).send({
//             error: true,
//             message
//         });
//     }
// };

// module.exports = {
//     getOrders,
//     paymentIntent,
//     updatePaymentStatus
// };






const stripe = require('stripe')(process.env.STRIPE_SECRET);
const { Order, Gig } = require('../models');
const { CustomException } = require('../utils');

const getOrders = async (request, response) => {
    try {
        const orders = await Order.find({ $and: [{ $or: [{ sellerID: request.userID }, { buyerID: request.userID }] }, { isCompleted: true }] }).populate(request.isSeller ? 'buyerID' : 'sellerID', 'username email image country');
        return response.send(orders);
    }
    catch ({ message, status = 500 }) {
        return response.send({
            error: true,
            message
        });
    }
};

const paymentIntent = async (request, response) => {
    const { _id } = request.params;

    try {
        const gig = await Gig.findOne({ _id });
        if (!gig) {
            throw new Error('Gig not found');
        }

        const amountInCents = gig.price * 100;
        if (amountInCents < 50) {
            throw new Error('Amount must convert to at least 50 cents.');
        }

        const payment_intent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: "INR",
            automatic_payment_methods: {
                enabled: true,
            },
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

    } catch (error) {
        console.error('Error creating payment intent:', error); // Log the error
        return response.status(500).send({
            error: true,
            message: error.message
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