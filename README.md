# 🍓 FRUITIFY - SaaS Procurement & Inventory

An enterprise-grade, AI-assisted procurement and inventory management platform for the hospitality industry.

## 🏗 Stack
- **Monorepo**: npm workspaces
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion, Recharts
- **Backend**: NestJS (API), Prisma (ORM), PostgreSQL
- **Auth**: NextAuth.js
- **Billing**: Stripe

## 🚀 Getting Started

### 1. Database Setup
```bash
# Start Docker containers
docker-compose up -d

# Push schema
npx prisma db push --schema=packages/database/schema.prisma
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development
```bash
# Start API
npm run dev --workspace=apps/api

# Start Web Application
npm run dev --workspace=apps/web
```

## 🤖 Advanced Features
- **Price Ingestion**: AI-assisted CSV processing for supplier price lists.
- **Demand Forecasting**: Predictive analytics for stock management.
- **Dynamic Pricing**: AI-driven cost optimization suggestions.
- **Stripe Billing**: Multi-tier subscription management.

## 🎨 UI Design System
Built with a custom **Fruit Color Theme**:
- 🍓 Strawberry Red (#E63946) - Primary
- 🍊 Orange Citrus (#F77F00) - Secondary
- 🥝 Kiwi Green (#43AA8B) - Success
- 🍇 Grape Purple (#5A189A) - Dark Mode
