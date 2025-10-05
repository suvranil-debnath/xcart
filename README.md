# 🛒 XCart – Fullstack Shopping Cart App

A simple, modern fullstack Shopping Cart webApp built as part of the Verto Associate Software Engineer (ASE) Challenge.
XCart demonstrates practical fullstack development skills — including authentication, database integration, UI design, and payment simulation — using the Next.js App Router, Firebase, and Razorpay.

## 🎯 Challenge Objective

This project fulfills the Fullstack Project requirement of the ASE Challenge.
The goal was to build a functional web app that highlights:

- Clean, modular, and scalable code
- Real-world development logic
- User-focused interface and design thinking
- End-to-end feature flow (Auth → Add to Cart → Checkout)

## 🌐 Live Demo

- 🔗 Deployed App: [https://xcart-ebon.vercel.app/](https://xcart-ebon.vercel.app/)
- 💻 Repository: [https://github.com/suvranil-debnath/xcart](https://github.com/suvranil-debnath/xcart)

## 🚀 Tech Stack

| Category | Technologies |
|----------|-------------|
| Frontend | Next.js 15 (App Router), React, TailwindCSS |
| Backend | Firebase Firestore (Database), Firebase Auth |
| Payment | Razorpay (Mock Checkout Integration) |
| State Management | React Context API |
| Deployment | Vercel |

## ✨ Key Features

- 🔐 **Google Authentication** – Secure login & registration using Firebase
- 🛍️ **Shopping Cart** – Add, update, and remove products
- 💖 **Favorites System** – Save favorite products for later
- 💸 **Mock Checkout** – Simulated payment using Razorpay demo flow
- 🕶️ **Dark Mode** – Clean, modern UI with dark theme support
- 📱 **Responsive UI** – Optimized for both desktop & mobile
- 🧾 **Order Tracking (Basic)** – Simulated order history per user

## 🧠 Design & Development Approach

- Followed component-driven architecture with reusable UI blocks
- Implemented Context API for global cart and auth state
- Prioritized readability and clarity over complexity
- Integrated Firebase Auth & Firestore for simplicity and reliability
- Used mock data for product catalog and Razorpay checkout simulation

## ⚙️ Getting Started

### 🔧 1. Clone the Repository
```bash
git clone https://github.com/suvranil-debnath/xcart.git
cd xcart
```

### 📦 2. Install Dependencies
```bash
npm install
```

### 🔑 3. Add Environment Variables

Create a .env.local file with:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
```

### ▶️ 4. Run the App
```bash
npm run dev
```

Visit http://localhost:3000

## 🧪 Running Tests

Currently, this project includes manual functional testing (UI & logic validation).
To test:

- Login via Google
- Add/remove products from cart
- Trigger mock checkout
- Check order/favorites persistence via Firebase Firestore

(Automated tests can be added using Jest/Playwright if required.)

## 🧩 Design Choices & Assumptions

- Used Firebase for quick setup, scalability, and authentication simplicity
- No backend server — handled via Firebase SDK to keep it lightweight
- Razorpay is integrated in test mode (no real payments)
- Product catalog uses mock data to focus on functional logic
- Emphasis placed on clean code, modular components, and UI polish


## ⚡ Deployment Details

- Hosting Platform: Vercel
- Build Command: next build
- Output Directory: .next
- Environment Management: Vercel Secrets (.env variables)

## 🧑‍💻 Author

👋 Suvranil Debnath

MCA Student | Aspiring Software Developer
📧 debnathsuvranil@gmail.com
