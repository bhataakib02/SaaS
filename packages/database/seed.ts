import { PrismaClient, Role, Unit } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Company
    const company = await prisma.company.create({
        data: {
            name: 'Berry Hospitality Group',
            businessType: 'Restaurant Chain',
            currency: 'USD',
            taxConfig: { vat: 20 },
        },
    });

    // 2. Create Venues
    const venue1 = await prisma.venue.create({
        data: {
            name: 'Strawberry Bar & Grill',
            companyId: company.id,
        },
    });

    const venue2 = await prisma.venue.create({
        data: {
            name: 'Orange Citrus Lounge',
            companyId: company.id,
        },
    });

    // 3. Create Users
    await prisma.user.createMany({
        data: [
            {
                email: 'admin@berryhospitality.com',
                name: 'Admin User',
                password,
                role: Role.COMPANY_ADMIN,
                companyId: company.id,
            },
            {
                email: 'procurement@berryhospitality.com',
                name: 'Procurement Manager',
                password,
                role: Role.PROCUREMENT_MANAGER,
                companyId: company.id,
            },
            {
                email: 'staff@berryhospitality.com',
                name: 'Bar Staff',
                password,
                role: Role.STAFF,
                companyId: company.id,
            },
        ],
    });

    // 4. Create Suppliers
    const supplier = await prisma.supplier.create({
        data: {
            name: 'Fresh Fruit Wholesalers',
            contactEmail: 'sales@freshfruit.com',
            companyId: company.id,
            rating: 5,
        },
    });

    // 5. Create Products
    await prisma.product.create({
        data: {
            name: 'Premium Red Wine',
            sku: 'WINE-RED-01',
            unit: Unit.BOTTLE,
            basePrice: 15.00,
            vat: 20,
            supplierId: supplier.id,
            companyId: company.id,
        },
    });

    console.log('Seed data created successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
