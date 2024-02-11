# Online Charity Auction Platform

## Disclaimer

This platform, created during a hackathon, serves as a proof of concept for demonstration purposes. While operational
for its showcase, it is expected to undergo further optimization and development. We appreciate your understanding and
welcome any feedback.

## Technologies

Leveraging a carefully selected stack of modern technologies, our platform aims to achieve optimal performance,
scalability, and an enhanced user experience:

- **Node.js**: Employs an efficient, event-driven architecture.
- **Next.js**: Combines React's flexibility with server-side rendering for better performance.
- **Socket.io**: Facilitates real-time web socket communication for seamless interaction.
- **TypeScript**: Improves code reliability and maintainability through static typing.
- **Redis**: Acts as a high-performance cache and message broker.
- **Docker**: Ensures consistent deployment environments and scalability.
- **PostgreSQL**: Provides robust, relational data storage capabilities.
- **Tailwind CSS**: Enables rapid development of responsive user interfaces.
- **Prisma**: Offers type-safe database access and schema management.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) must be installed on your system.
- Perform a first-time login after project initialization to ensure functionality.

### Setup and Execution

**Option 1: Local Setup (Without Docker)**

1. Clone the repository and navigate to the directory:
    ```sh
    git clone https://github.com/DuLL-FoX/int20-Test
    cd int20-Test
    ```

2. Within the prisma folder, create a `.env` file. For simplicity, use the provided unsecured database credentials.
   Insert the following into the `.env` file to connect to the database:
    ```sh
    DATABASE_URL="postgresql://int20test:test@130.162.253.235:5432/int20_test"
    ```

3. Install dependencies:
    ```sh
    npm install
    cd real_time_server && npm install
    ```

4. Build and start the application:
    ```sh
    npx prisma generate
    npm run build
    npm start
    cd real_time_server && npm start
    ```
5. The application will be accessible at `http://localhost:3000`.

**Option 2: Docker Deployment**

1. Clone the repository and deploy using Docker:
    ```sh
    git clone https://github.com/DuLL-FoX/int20-Test
    docker-compose up --build
    ```
2. The application will be available at `http://localhost:3000`.

***Data Configuration for Docker Deployment***

The docker-compose setup utilizes the same database credentials by default. To use a local database, modify
the `DATABASE_URL` in the docker-compose file to:

```sh
DATABASE_URL=postgresql://postgres:password@postgres:5432/int20?schema=public
```

## Features

### Core Auction Features

- **Auction Management**: Enables the seamless creation and real-time monitoring of auctions.
- **Bidding System**: Supports live bids and updates for interactive auction participation.
- **Interaction**: Includes chat functionality and bid history for enhanced engagement.

### Advanced Functionalities

- **Live Bidding**: Implements web sockets for immediate notification and update delivery.
- **Real-Time Updates**: Ensures instant reflection of auction status, chat, and bid modifications.

## Additional Notes

Editing auctions is supported in the backend, with UI integration planned for future updates.

## Connect

For inquiries, feel free to reach out through [Telegram](https://t.me/DuLL_FoX).