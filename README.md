# ParkWise

*ParkWise* is an IoT and Machine Learning-based parking booking system designed to streamline the process of finding, booking, and managing parking spaces. The system includes a *web application* (built with React.js) and a *mobile application* (built with Flutter) with three distinct roles: *Users, **Admin, and **Landowners*. ParkWise leverages IoT sensors for real-time parking slot availability and ML algorithms for predictive analytics and optimal parking recommendations.

---

## Features

### *For Users*
- *User Authentication*: Sign up, log in, and manage your profile.
- *Real-Time Parking Availability*: View available parking slots in real-time using IoT sensor data.
- *Parking Slot Booking*: Book available parking slots for a specific duration.
- *Parking Recommendations*: Get ML-based recommendations for the best parking slots based on historical data and user preferences.
- *Payment Integration*: Securely pay for parking slots using integrated payment gateways.
- *Booking History*: View and manage past and upcoming bookings.
- *Notifications*: Receive real-time notifications for booking confirmations, reminders, and updates.

### *For Landowners*
- *Parking Slot Management*: Add, update, or remove parking slots owned by the landowner.
- *Real-Time Monitoring*: Monitor parking slot occupancy in real-time using IoT sensors.
- *Revenue Tracking*: View earnings and transaction history for owned parking slots.
- *Booking Requests*: Approve or reject booking requests from users.
- *Analytics*: Access ML-based insights on parking slot usage and revenue trends.

### *For Admin*
- *User Management*: Manage all users, landowners, and their roles.
- *Parking Slot Oversight*: View and manage all parking slots in the system.
- *Revenue Reports*: Generate and view revenue reports for the entire system.
- *System Analytics*: Access ML-based analytics for system performance, user behavior, and parking trends.
- *IoT Device Management*: Monitor and manage IoT sensors and devices across all parking locations.
- *Issue Resolution*: Resolve user and landowner issues or disputes.

---

## Technologies Used

### *Frontend (Web)*
- React.js
- Tailwind CSS
- Vite (Build Tool)

### *Mobile Application*
- Flutter (for cross-platform mobile app development)

### *Backend*
- Node.js
- Express.js
- MongoDB (Database)
- Socket.IO (Real-Time Updates)

### *IoT Integration*
- IoT Sensors (for real-time parking slot monitoring)
- MQTT Protocol (for IoT communication)

### *Machine Learning*
- Python (for ML models)
- TensorFlow or Scikit-Learn (for predictive analytics)
- Flask (for ML model API integration)

### *Authentication*
- JWT (JSON Web Tokens)

### *Payment Integration*
- Stripe or PayPal (for secure payments)

### *Other Tools*
- Postman (API Testing)
- Git (Version Control)
- Docker (Containerization)

---

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)
- MongoDB (for database)
- Python (for ML models)
- Flutter SDK (for mobile app development)
- IoT Sensor Simulator (for testing)

### Installation

1. *Clone the Repository*:
   ```bash
   git clone https://github.com/Kelum-Tharindu/GAHDSE241F-ParkWise.git
   cd parkwise
