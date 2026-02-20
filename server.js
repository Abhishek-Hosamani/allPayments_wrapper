/**
 * Example Express server showing webhook integration.
 * 
 * IMPORTANT: The webhook route MUST use express.raw() — not express.json()
 * Stripe verifies the raw bytes of the request body.
 */

const express = require('express');
const AllPaymentsWrapper = require('../src/index');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Init SDK ─────────────────────────────────────────────────────────────────
const payments = new AllPaymentsWrapper({
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        onError: (err, ctx) => console.error('[stripe]', ctx.method, err.message),
    },
});

// ── Apply express.json() globally EXCEPT for the webhook route ───────────────
app.use((req, res, next) => {
    if (req.originalUrl === '/webhook/stripe') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// ── Webhook route ─────────────────────────────────────────────────────────────
app.post(
    '/webhook/stripe',
    express.raw({ type: 'application/json' }),
    (req, res) => {
        const sig = req.headers['stripe-signature'];

        let event;
        try {
            event = payments.stripe.webhooks.constructEvent(req.body, sig);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // ── Handle events ─────────────────────────────────────────────────────────
        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('✅ PaymentIntent succeeded:', event.data.object.id);
                // fulfil your order here
                break;

            case 'payment_intent.payment_failed':
                console.log('❌ PaymentIntent failed:', event.data.object.id);
                break;

            case 'customer.subscription.created':
                console.log('📦 Subscription created:', event.data.object.id);
                break;

            case 'customer.subscription.deleted':
                console.log('🗑 Subscription cancelled:', event.data.object.id);
                break;

            case 'invoice.payment_succeeded':
                console.log('💰 Invoice paid:', event.data.object.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.sendStatus(200);
    }
);

// ── Example API route ─────────────────────────────────────────────────────────
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency = 'usd', customerId } = req.body;

        const intent = await payments.stripe.paymentIntents.create({
            amount,
            currency,
            customer: customerId,
            automatic_payment_methods: { enabled: true },
        });

        res.json({ clientSecret: intent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));