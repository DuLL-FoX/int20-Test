# Online Charity Auction Platform

A full-stack charity auction platform with real-time bidding and chat functionality. Built during a hackathon as a proof of concept, featuring live auctions, user authentication, and responsive design.

## Overview

This platform enables charitable organizations to host online auctions with real-time bidding capabilities. Users can create auctions, list items, place bids, and communicate through integrated chat functionality.

### Key Features

- **Real-time Bidding**: Live bid updates using WebSocket technology
- **Auction Management**: Create, monitor, and manage charity auctions
- **Interactive Chat**: Real-time messaging for each auction
- **User Authentication**: Secure registration and login system
- **Search Functionality**: Find auctions by name or keywords
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS
- **Contact Integration**: Manage contact information for auction organizers

## Technology Stack

**Frontend**
- **Next.js 14**: React framework with App Router for server-side rendering
- **TypeScript**: Type-safe development with static typing
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Radix UI**: Accessible component primitives

**Backend**
- **Node.js**: JavaScript runtime for server-side development
- **Prisma ORM**: Type-safe database access and schema management
- **PostgreSQL**: Robust relational database for data storage
- **Socket.io**: Real-time WebSocket communication
- **Redis**: High-performance caching and message broker

**Development & Deployment**
- **Docker**: Containerization for consistent deployment environments
- **Docker Compose**: Multi-service orchestration

## Getting Started

### Prerequisites

- **Node.js 18+**: [Download and install Node.js](https://nodejs.org/en/)
- **Git**: Version control system
- **Database**: PostgreSQL instance (external provided or local)
- **Redis**: Redis server for real-time features (external provided or local)

### Installation & Setup

**Option 1: Local Development Setup**

1. **Clone the repository**
    ```bash
    git clone https://github.com/DuLL-FoX/int20-Test
    cd int20-Test
    ```

2. **Database Configuration**
   
   Create a `.env` file in the `prisma/` directory:
    ```bash
    # For demo purposes (provided external database)
    DATABASE_URL="postgresql://int20test:test@130.162.253.235:5432/int20_test"
    
    # For local PostgreSQL (optional)
    # DATABASE_URL="postgresql://username:password@localhost:5432/auction_db"
    ```

3. **Install Dependencies**
    ```bash
    # Install main application dependencies
    npm install
    
    # Install real-time server dependencies
    cd real_time_server && npm install && cd ..
    ```

4. **Database Setup**
    ```bash
    # Generate Prisma client
    npx prisma generate
    
    # Optional: View/edit data with Prisma Studio
    npx prisma studio
    ```

5. **Start Development Servers**
    ```bash
    # Terminal 1: Start Next.js frontend (port 3000)
    npm run dev
    
    # Terminal 2: Start Socket.io server (port 3001)
    cd real_time_server && npm start
    ```

6. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Real-time server: `http://localhost:3001`

**Important**: Both servers must be running for full functionality. Perform a first-time login after setup to ensure proper initialization.

**Option 2: Docker Deployment**

1. **Quick Start with Docker**
    ```bash
    git clone https://github.com/DuLL-FoX/int20-Test
    cd int20-Test
    docker-compose up --build
    ```

2. **Access the Application**
   - Application: `http://localhost:3000`

**Docker Configuration Notes**
- By default, uses the same external database credentials
- To use a local PostgreSQL container, modify the `DATABASE_URL` in `docker-compose.yml`:
  ```bash
  DATABASE_URL=postgresql://postgres:password@postgres:5432/int20?schema=public
  ```

## Architecture

This application follows a microservice architecture with separate concerns:

- **Frontend Server** (Next.js on port 3000): Handles web interface, API routes, and server-side rendering
- **Real-time Server** (Socket.io on port 3001): Manages WebSocket connections for live bidding and chat
- **Database** (PostgreSQL): Stores auction data, user accounts, and bid history
- **Cache/Pub-Sub** (Redis): Coordinates real-time events between servers

## Development

### Available Scripts

**Frontend (Next.js)**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint linting
```

**Real-time Server**
```bash
cd real_time_server
npm start        # Start Socket.io server
```

**Database Management**
```bash
npx prisma generate    # Generate Prisma client after schema changes
npx prisma db push     # Push schema changes to database
npx prisma studio      # Open Prisma Studio for data management
```

### Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts for state management
│   └── lib/              # Utility functions and configurations
├── real_time_server/     # Socket.io server for real-time features
├── prisma/               # Database schema and configuration
├── public/               # Static assets
└── docker-compose.yml    # Multi-container deployment setup
```

### Database Schema

Key entities and relationships:
- **Users**: Authentication and user management
- **Auctions**: Main auction events with metadata
- **AuctionLots**: Individual items within auctions
- **AuctionBids**: Bid history and current highest bids
- **ChatSessions & Messages**: Real-time messaging per auction
- **ContactPoints**: Organizer contact information

## Deployment Considerations

### Production Checklist
- [ ] Set secure database credentials
- [ ] Configure Redis for production use
- [ ] Set up proper environment variables
- [ ] Enable HTTPS for production deployment
- [ ] Configure CORS settings appropriately
- [ ] Set up monitoring and logging

### Environment Variables
Create appropriate `.env` files for:
- Database connection (`DATABASE_URL`)
- Redis connection (`REDIS_URL`)
- Next.js configuration variables

## Known Limitations & Future Enhancements

- Auction editing UI is pending (backend support exists)
- Basic search functionality (can be enhanced with full-text search)
- Authentication system could be enhanced with OAuth providers
- Mobile app support could be added
- Payment integration for completed auctions

## Contributing

This is a hackathon proof-of-concept. For inquiries or contributions, reach out through [Telegram](https://t.me/DuLL_FoX).

## Disclaimer

This platform was created during a hackathon for demonstration purposes. While functional for its intended showcase, it requires further optimization and security enhancements for production use.