# Shiplyne

Shiplyne is a modern web platform for managing and tracking shipments, bids, and logistics between factories and transporters. It provides real-time shipment updates, bid management, and scheduling for both transport and factory owners.

## Features

- **Role-based Dashboard:** Separate views and controls for Factory Owners and Transport Owners.
- **Route Management:** Factories can create and manage shipment routes.
- **Bid Management:** Transporters can place bids on available routes. Factories can accept/reject bids.
- **Real-Time Shipment Updates:** Shipments are automatically updated when bids are accepted.
- **Schedule & History:** Both roles can view their scheduled and historical shipments.
- **Mock Data for Dev:** The app uses mock data for users, routes, bids, and shipments for easy local development and testing.

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/arpanpuri/Shiplyne.git
   cd Shiplyne
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open your browser and go to `http://localhost:5173` (or as shown in the terminal)

## Project Structure

- `src/pages/` — Main app pages (dashboard, shipments, routes, etc.)
- `src/components/` — Reusable UI components
- `src/context/` — React context for shared state (routes, bids)
- `src/lib/mockData.ts` — Mock data for users, vehicles, routes, bids, shipments
- `src/lib/types.ts` — TypeScript interfaces and types

## Usage
- **Factory Owners:**
  - Create routes
  - View and accept/reject bids
  - Track scheduled and completed shipments
- **Transport Owners:**
  - View available routes
  - Place bids
  - Track assigned and completed shipments

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.


---

*For questions or support, open an issue on GitHub or contact the maintainer.*
