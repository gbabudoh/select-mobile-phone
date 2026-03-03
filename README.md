# Select Mobile Phone Marketplace

A comprehensive B2B/B2C mobile phone marketplace platform built with Next.js, featuring multi-vendor support, AI-powered assistance, and advanced e-commerce capabilities for the North American market (US & Canada).

## Overview

Select Mobile is a full-featured marketplace that connects buyers, individual sellers, retailers, wholesalers, and network providers in a unified platform. The system supports normal orders, preorders, trade-ins, eSIM provisioning, escrow payments, and cross-border transactions.

## Key Features

### Multi-Role Support
- **Buyers**: Browse products, place orders, manage preorders, trade-in devices
- **Individual Sellers**: List used devices, manage sales, track performance
- **Retailers**: Manage inventory, process orders, view analytics
- **Wholesalers**: Bulk inventory management, tiered pricing, B2B operations
- **Network Providers**: eSIM provisioning, plan management, revenue tracking

### Core Functionality
- **AI Mobile Guide**: Groq-powered chatbot for product recommendations and support
- **Preorder Engine**: Queue-based system with deposit management and real-time position tracking
- **Trade-In System**: Lock-in valuations before device launches
- **TCO Calculator**: Compare total cost of ownership for unlocked vs carrier-locked devices
- **Escrow Protection**: Secure payment holding until buyer confirmation
- **eSIM Provisioning**: Instant activation at checkout
- **Cross-Border Support**: Seamless US/Canada transactions
- **Select-Verified**: 50-point diagnostic scoring for quality assurance

### Technical Features
- Role-based dashboards with custom layouts
- Real-time inventory synchronization
- Bulk import/export (CSV, XLSX, PDF)
- Advanced filtering and search
- Responsive design with Framer Motion animations
- NextAuth.js authentication
- Prisma ORM with PostgreSQL
- TypeScript throughout

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: Groq API (Llama 3.3 70B)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF
- **Excel Export**: SheetJS (xlsx)
- **Image Handling**: Next.js Image Optimization

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Groq API key (free tier available at [console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gbabudoh/select-mobile-phone.git
cd select-mobile-phone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env file with:
DATABASE_URL="postgresql://user:password@host:port/database"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GROQ_API_KEY="your-groq-api-key"
LLM_MODEL="llama-3.3-70b-versatile"
```

4. Initialize the database:
```bash
npx prisma db push
```

5. Seed demo accounts:
```bash
npx tsx prisma/seed-demo.ts
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Demo Accounts

The platform includes 5 pre-configured demo accounts for testing:

| Email | Password | Role |
|-------|----------|------|
| buyer@demo.com | buyer1234 | Buyer |
| individual@demo.com | individual1234 | Individual Seller |
| retail@demo.com | retail1234 | Retailer |
| wholesale@demo.com | wholesale1234 | Wholesaler |
| network@demo.com | network1234 | Network Provider |

## Project Structure

```
select-mobile-phone/
├── app/
│   ├── ai-guide/              # AI chatbot interface
│   ├── buyer/dashboard/       # Buyer dashboard
│   ├── individual/dashboard/  # Individual seller dashboard
│   ├── retailer/dashboard/    # Retailer dashboard
│   ├── wholesaler/dashboard/  # Wholesaler dashboard
│   ├── network-provider/dashboard/ # Network provider dashboard
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── chat/              # AI chat endpoint
│   │   ├── listings/          # Product listings
│   │   ├── orders/            # Order management
│   │   ├── preorders/         # Preorder system
│   │   └── trade-in/          # Trade-in valuations
│   ├── product/[id]/          # Product detail pages
│   ├── tco-calculator/        # TCO comparison tool
│   └── trade-in/              # Trade-in flow
├── components/
│   ├── dashboard/             # Shared dashboard components
│   ├── tco/                   # TCO calculator components
│   └── ...                    # Other shared components
├── lib/
│   ├── auth.ts                # Authentication utilities
│   ├── prisma.ts              # Prisma client
│   └── products.ts            # Product data
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed-demo.ts           # Demo account seeder
└── types/                     # TypeScript type definitions
```

## Key Routes

- `/` - Homepage with featured products
- `/ai-guide` - AI-powered mobile assistant
- `/tco-calculator` - Total cost of ownership calculator
- `/trade-in` - Trade-in valuation tool
- `/preorder` - Active preorder campaigns
- `/product/[id]` - Product detail page
- `/login` - User authentication
- `/register` - New user registration
- `/[role]/dashboard` - Role-specific dashboards

## Database Schema

The platform uses a comprehensive Prisma schema supporting:
- User management with role-based profiles
- Product catalog with listings
- Order processing (normal & preorders)
- Escrow transactions
- Trade-in management
- eSIM inventory and provisioning
- Network plans
- Chat sessions and messages
- Reviews and notifications
- Analytics and dashboard stats

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset

### Core Features
- `POST /api/chat` - AI chatbot interaction
- `GET /api/listings` - Fetch product listings
- `POST /api/orders` - Create order
- `GET /api/orders` - Fetch user orders
- `POST /api/preorders` - Create preorder
- `POST /api/trade-in` - Get trade-in quote
- `GET /api/dashboard/[role]` - Role-specific dashboard data

## Features in Detail

### AI Mobile Guide
- Powered by Groq's Llama 3.3 70B model
- Context-aware conversations with session persistence
- Product recommendations based on marketplace data
- Cross-border plan suggestions
- TCO comparisons and trade-in guidance

### Preorder System
- Queue-based allocation with real-time position tracking
- Deposit management with Stripe integration
- Trade-in value lock-in for future purchases
- Automated order conversion on product availability

### TCO Calculator
- Compare unlocked + BYOP vs carrier contracts
- 24-month cost projection
- Cross-border plan analysis
- Savings visualization

### Escrow Protection
- Payment held until buyer confirms delivery
- IMEI verification
- SIM activation confirmation
- Dispute resolution support

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Database Management
```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev

# Push schema changes
npx prisma db push

# Open Prisma Studio
npx prisma studio
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | Yes |
| NEXTAUTH_SECRET | NextAuth.js secret key | Yes |
| NEXTAUTH_URL | Application URL | Yes |
| GROQ_API_KEY | Groq API key for AI features | Yes |
| LLM_MODEL | Groq model name | No (defaults to llama-3.3-70b-versatile) |

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Stripe payment integration
- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Automated diagnostic testing integration
- [ ] Blockchain-based escrow
- [ ] AR product visualization

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- AI powered by [Groq](https://groq.com)
- Database management with [Prisma](https://prisma.io)
- Authentication via [NextAuth.js](https://next-auth.js.org)
