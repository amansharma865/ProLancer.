const paymentIntent = async (request, response) => {
    const { _id } = request.params;

    try {
        // Check if user is authenticated
        if (!request.userID) {
            return response.status(401).send({
                error: true,
                message: 'You are not authenticated!'
            });
        }

        const gig = await Gig.findOne({ _id });
        if (!gig) {
            return response.status(404).send({
                error: true,
                message: 'Gig not found'
            });
        }

        // Prevent sellers from buying their own gigs
        if (gig.userID.toString() === request.userID.toString()) {
            return response.status(400).send({
                error: true,
                message: 'You cannot purchase your own gig!'
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

module.exports = {
    getOrders,
    paymentIntent,
    updatePaymentStatus
};
