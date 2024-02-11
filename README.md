# Online Charity Auction Platform

## Disclaimer

Developed under the constraints of a hackathon, this platform is a proof of concept designed for demonstration. While fully functional for its intended showcase, ongoing optimization and feature completion are anticipated. Your understanding and feedback are valued.

## Technologies

Our platform harnesses a curated stack of modern technologies, each chosen for its contribution to our performance, scalability, and user experience goals:
- **Node.js** for its efficient, event-driven architecture.
- **Next.js** to unify the benefits of React with server-side rendering.
- **Socket.io** for seamless real-time web socket communication.
- **TypeScript** to enhance code reliability and maintainability.
- **Redis** as a high-performance cache and message broker.
- **Docker** for consistent deployment and scalability.
- **PostgreSQL** for robust, relational data storage.

## Getting Started

### Prerequisites

- Ensure [Node.js](https://nodejs.org/en/) is installed on your machine.

### Setup and Run

**Option 1: Dry Run (Without Docker)**
1. Clone and navigate:
    ```sh
    git clone https://github.com/DuLL-FoX/int20-Test
    cd int20-Test
    ```
2. Install dependencies:
    ```sh
    npm install
    cd real_time_server && npm install
    ```
3. Build and start:
    ```sh
    npm run build
    npm start
    cd real_time_server && npm start
    ```
4. Access at `http://localhost:3000`.

**Option 2: Using Docker**
1. Clone and deploy:
    ```sh
    git clone https://github.com/DuLL-FoX/int20-Test
    docker-compose up --build
    ```
2. Navigate to `http://localhost:3000`.

## Features

### Core Auction Features
- **Auction Management**: Seamless creation and real-time viewing of auctions.
- **Bidding System**: Engage with auctions through live bids and updates.
- **Interaction**: Real-time chat and bid history for enhanced user engagement.

### Advanced Functionalities
- **Live Bidding**: Utilize web sockets for instant notification and updates.

## Additional Notes

Editing auctions is supported in the backend, with UI integration planned for future updates.

## Connect

For inquiries, feel free to reach out through [Telegram](https://t.me/DuLL_FoX).