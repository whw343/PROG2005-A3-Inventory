# PROG2005 A3 — Inventory Mobile App

An Ionic/Angular mobile inventory management application with Capacitor Android integration, built for PROG2005 Programming Mobile Systems at Southern Cross University.

## Tech Stack

| Technology | Version |
|------------|---------|
| Ionic | 8.8.4 |
| Angular | 20 |
| TypeScript | 5.9 |
| Capacitor | 7.6.2 |
| Android | SDK 34 |

## Features

### Tab 1 — Inventory List
- Browse all inventory items from the REST API
- Real-time search by item name
- Filter by category and featured status
- Pull-to-refresh for live data updates
- Empty state handling with clear filter option

### Tab 2 — Add Item
- Complete form with client-side validation
- Fields: Name, Category, Quantity, Price, Supplier, Stock Status, Featured, Special Note
- Success/error feedback after API submission
- Featured items list displayed below the form

### Tab 3 — Update & Delete
- Select any item to edit in-place
- Partial updates — only changed fields are sent to the API
- Swipe-to-delete with confirmation modal
- Protected item rule: "Laptop" cannot be deleted

### Tab 4 — Privacy & Security
- 6 security topics with mobile-specific focus
- Best practices for this application
- External references (OWASP, Android, Capacitor, Angular, NIST)
- GenAI Level 2 use declaration

## API

The app connects to the SCU REST API:

```
Base URL: https://prog2005.it.scu.edu.au/ArtGalley

GET    /ArtGalley          → All items
GET    /ArtGalley/{name}   → Items matching name (array)
POST   /ArtGalley          → Create item
PUT    /ArtGalley/{name}   → Update item by name
DELETE /ArtGalley/{name}   → Delete item by name
```

API returns snake_case field names: `item_id`, `item_name`, `category`, `quantity`, `price`, `supplier_name`, `stock_status`, `featured_item`, `special_note`.

## Project Structure

```
src/app/
├── models/
│   └── inventory-item.model.ts    # Data interfaces & constants
├── services/
│   └── api.service.ts             # REST API service
├── components/
│   └── help-widget/               # Reusable help modal component
├── tabs/                          # Tab navigation
├── tab1/                          # Inventory list
├── tab2/                          # Add item form
├── tab3/                          # Update & delete
└── tab4/                          # Privacy & security
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npx ng serve
```

Open `http://localhost:4200` in your browser.

### Build for Production

```bash
npx ng build
```

Output goes to `www/` directory.

### Android Build

```bash
npx cap sync android
npx cap open android
```

## Testing

```bash
npx ng test
```

Unit tests cover:
- API service (CRUD operations)
- Tab1 (search, filter, format)
- Tab2 (form validation, submission)
- Tab3 (update, delete, protection)
- Help widget component

## Authors

| Name | GitHub |
|------|--------|
| Hanyu Man | whw343 |
| Daitong Xiao | daitongxiao |
| Bingru Song | BingruSong |

## Course Information

- **Course**: PROG2005 — Programming Mobile Systems
- **Institution**: Southern Cross University
- **Assignment**: Assessment 3 — Ionic Mobile App
