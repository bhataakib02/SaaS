import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
    private stripe: Stripe;

    constructor(private prisma: PrismaService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
            apiVersion: '2025-01-27ts' as any,
        });
    }

    async createCheckoutSession(companyId: string, priceId: string) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
        });

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing?success=true`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard/settings/billing?canceled=true`,
            metadata: {
                companyId,
            },
        });

        return { url: session.url };
    }

    async getSubscriptionStatus(companyId: string) {
        // In a real app, you'd store Stripe Customer ID and Subscription ID in the Company model
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
        });

        return {
            plan: 'Basic', // Hardcoded for now
            status: 'active',
            nextBilling: new Date().toISOString(),
        };
    }
}
