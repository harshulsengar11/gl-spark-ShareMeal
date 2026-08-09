# 🍱 ShareMeal

### Smart Food Donation & Distribution Platform

ShareMeal is a microservices-based food donation platform that connects food donors with NGOs to reduce food wastage and ensure surplus food reaches people in need.

The platform enables donors to publish food listings, NGOs to search food by city, claim available food, rate food providers, and receive real-time notifications through Apache Kafka. ShareMeal also features a **Top Donors Leaderboard** that recognizes the most impactful contributors on the platform.

Built using Spring Boot, Spring Cloud, PostgreSQL, Apache Kafka, JWT Authentication, OpenFeign, Eureka Service Discovery, Config Server, and React + Vite.

---

# 📌 Project Overview

Food waste is a major challenge faced by restaurants, food outlets, and event organizers, while many NGOs struggle to secure sufficient food resources for the communities they serve.

ShareMeal bridges this gap by creating a digital platform where:

- Donors can publish surplus food.
- NGOs can discover and claim food donations.
- NGOs can search food donations by city.
- NGOs can rate food providers.
- Donors can track their contribution impact.
- Top contributors are recognized through a donor leaderboard.
- Notifications are delivered using an event-driven architecture.
- Expired food is automatically managed by schedulers.

The platform follows a **Microservices Architecture**, allowing services to be independently developed, deployed, and scaled.

---

# 🎯 Key Features

## 👨‍🍳 Donor Features

- User Registration
- User Login
- JWT Authentication
- Add Food Listings
- Update Food Listings
- Delete Food Listings
- Manage Donations
- Track Donation History
- Receive Claim Notifications
- Earn Ranking Points
- Appear on Top Donors Leaderboard

---

## 🏢 NGO Features

- NGO Registration
- NGO Login
- Browse Available Food
- Search Food by City
- View Food Details
- Claim Food Donations
- View Claim History
- Rate Restaurants and Food Providers
- Receive Claim Notifications

---

## 🍱 Food Management

- Food Listing Creation
- Quantity Tracking
- Food Availability Management
- Expiry Date Tracking
- Food Status Updates
- Reservation Workflow
- Automatic Expiry Processing

---

## 📍 City-Based Food Search

NGOs can search and filter food donations by city.

### Benefits

- Faster food discovery
- Localized food distribution
- Reduced transportation delays
- Better matching between donors and NGOs

---

## ⭐ Restaurant Rating System

NGOs can provide ratings after receiving food donations.

### Benefits

- Builds trust within the platform
- Encourages quality food donations
- Helps NGOs identify reliable donors
- Improves transparency

---

## 🏅 Top Donors Leaderboard

ShareMeal recognizes the most active donors through a leaderboard system.

### Ranking Factors

- Number of food donations
- Quantity of food donated
- Successful donation activity
- Donation consistency
- Community contribution

### Benefits

- Encourages regular donations
- Rewards active contributors
- Builds trust within the community
- Promotes healthy engagement

---

## 🔔 Notification System

- Food Claim Notifications
- NGO Confirmation Notifications
- Kafka-Based Event Processing
- Event-Driven Communication

---

## ⏰ Food Lifecycle Management

- Food Expiry Detection
- Automatic Status Updates
- Scheduler-Based Processing
- Reservation Window Handling
- Expired Food Management

---

## 🔐 Security

- JWT Authentication
- JWT Validation
- Role-Based Access Control
- Protected APIs
- API Gateway Security
- CORS Configuration

---

# 🏗️ System Architecture

```text
                     ┌───────────────────────────┐
                     │     React + Vite UI       │
                     └─────────────┬─────────────┘
                                   │
                                   ▼
                     ┌───────────────────────────┐
                     │       API Gateway         │
                     │ Routing + JWT Validation  │
                     └─────────────┬─────────────┘
                                   │
      ┌────────────────────────────┼───────────────────────────┐
      │                            │                           │
      ▼                            ▼                           ▼

┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│ Auth Service │          │ Food Service │          │ Claim Service│
└──────┬───────┘          └──────┬───────┘          └──────┬───────┘
       │                         │                         │
       ▼                         ▼                         ▼

 PostgreSQL                PostgreSQL                PostgreSQL

                                   │
                                   ▼

                         ┌──────────────────┐
                         │ Notification     │
                         │ Service          │
                         └────────┬─────────┘
                                  │
                                  ▼

                             PostgreSQL

                                  ▲
                                  │

                             Apache Kafka

                                  ▲
                                  │

                        food-claimed-events

────────────────────────────────────────────────

            Eureka Server + Config Server
```

---

# 🧩 Microservices

| Service | Responsibility |
|----------|---------------|
| Eureka Server | Service Discovery |
| Config Server | Centralized Configuration |
| API Gateway | Routing, Security, JWT Validation |
| Auth Service | Registration, Login, User Management |
| Food Service | Food Listings, Search, Ratings |
| Claim Service | Food Claiming, Kafka Event Publishing |
| Notification Service | Notification Management, Kafka Consumer |

---

# 🔄 Core User Flow

```text
Donor Registration / Login
            │
            ▼
      Add Food Listing
            │
            ▼
 Donation Statistics Updated
            │
            ▼
Top Donors Leaderboard Updated
            │
            ▼
Food Available In Selected City
            │
            ▼
         NGO Login
            │
            ▼
      Search By City
            │
            ▼
   Browse Food Listings
            │
            ▼
 Check Restaurant Ratings
            │
            ▼
         Claim Food
            │
            ▼
     Claim Service
            │
            ▼
 Publish Kafka Event
            │
            ▼
 Notification Service
            │
            ▼
 Generate Notifications
            │
            ▼
 Food Status Updated
```

---

# 🏅 Donor Leaderboard Flow

```text
Donor Adds Food
        │
        ▼
Donation Count Updated
        │
        ▼
Contribution Score Calculated
        │
        ▼
Leaderboard Recalculated
        │
        ▼
Top Donors Displayed
```

---

# 📨 Kafka Event Flow

```text
NGO Claims Food
       │
       ▼
Claim Service
       │
       ▼
Publish Event
(food-claimed-events)
       │
       ▼
Apache Kafka
       │
       ▼
Notification Service
       │
       ▼
Generate Notifications
       │
       ├──► Donor Notification
       │
       └──► NGO Notification
```

---

# 🔐 Authentication Flow

```text
User
 │
 ▼
Login
 │
 ▼
Auth Service
 │
 ▼
Generate JWT
 │
 ▼
Frontend
 │
 ▼
Authorization: Bearer <token>
 │
 ▼
API Gateway
 │
 ▼
Validate JWT
 │
 ▼
Protected Service
```

### Roles

- DONOR
- NGO

---

# 🌐 API Gateway

The API Gateway acts as the single entry point for all client requests.

### Responsibilities

- Request Routing
- JWT Validation
- Security Enforcement
- Authentication Checks
- Request Forwarding
- CORS Configuration

### Routes

```text
/auth/**            → AUTH-SERVICE
/foods/**           → FOOD-SERVICE
/claims/**          → CLAIM-SERVICE
/notifications/**   → NOTIFICATION-SERVICE
```

---

# 🔎 Service Discovery

ShareMeal uses Netflix Eureka for service registration and discovery.

### Benefits

- Dynamic Service Discovery
- Reduced Hardcoded URLs
- Better Scalability
- Easier Service Communication
- Load Balancing Support

---

# ⚙️ Configuration Management

ShareMeal uses Spring Cloud Config Server.

### Benefits

- Centralized Configuration
- Environment Management
- Easier Maintenance
- Consistent Service Settings

---

# 💻 Technology Stack

## Frontend

- React
- TypeScript
- Vite
- Material UI
- Axios

## Backend

- Java 17
- Spring Boot
- Spring Security
- Spring Cloud Gateway
- Spring Cloud OpenFeign
- Spring Data JPA
- Hibernate
- Netflix Eureka
- Config Server

## Messaging

- Apache Kafka

## Database

- PostgreSQL

## Build Tools

- Maven
- Git
- GitHub

---

# 📁 Project Structure

```text
gl-spark-ShareMeal/
│
├── eureka-server/
├── config-server/
├── api-gateway/
├── auth-service/
├── food-service/
├── claim-service/
├── notification-service/
├── sharemeal-frontend/
│
├── README.md
└── .gitignore
```

---

# ⚙️ Service Ports

| Service | Port |
|----------|------|
| Eureka Server | 8761 |
| Config Server | 8888 |
| API Gateway | 8080 |
| Auth Service | 8081 |
| Food Service | 8082 |
| Claim Service | 8083 |
| Notification Service | 8084 |
| Frontend | 5173 |

---

# 🗄️ Database Architecture

ShareMeal follows the Database-per-Service pattern.

| Service | Database |
|----------|----------|
| Auth Service | Auth Database |
| Food Service | Food Database |
| Claim Service | Claim Database |
| Notification Service | Notification Database |

### Benefits

- Data Isolation
- Independent Ownership
- Better Scalability
- Easier Maintenance

---

# 🔗 Inter-Service Communication

## Synchronous Communication

- REST APIs
- OpenFeign Clients

Example:

```java
@FeignClient(name = "AUTH-SERVICE")
public interface AuthFeignClient {
}
```

Used for:

- User Information Retrieval
- User Validation
- Service-to-Service Communication

---

## Asynchronous Communication

Apache Kafka is used for:

- Food Claim Events
- Notification Processing
- Event-Driven Workflows

### Kafka Topic

```text
food-claimed-events
```

---

# ⚙️ Environment Setup

Each service reads sensitive information from local `.env` files.

### Required Variables

#### auth-service

```properties
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET_KEY=
JWT_EXPIRATION=
```

#### food-service

```properties
DB_URL=
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET_KEY=
```

#### claim-service

```properties
DB_URL=
DB_USERNAME=
DB_PASSWORD=
KAFKA_BOOTSTRAP_SERVERS=
```

#### notification-service

```properties
DB_URL=
DB_USERNAME=
DB_PASSWORD=
KAFKA_BOOTSTRAP_SERVERS=
```

#### frontend

```properties
VITE_API_BASE_URL=
```

> Auth Service and Food Service must use the same JWT secret.

---

# 🚀 Getting Started

## Prerequisites

- Java 17+
- Maven
- PostgreSQL
- Apache Kafka
- Node.js
- npm
- Git

---

## Clone Repository

```bash
git clone https://github.com/harshulsengar11/gl-spark-ShareMeal.git
cd gl-spark-ShareMeal
```

---

## Start Infrastructure

### PostgreSQL

Create databases:

- sharemeal_db
- food_db
- sharemeal_claim_db

### Kafka

Start Kafka broker on:

```text
localhost:9092
```

---

## Start Services

```text
1. Eureka Server
2. Config Server
3. API Gateway
4. Auth Service
5. Food Service
6. Claim Service
7. Notification Service
8. Frontend
```

---

## Run Frontend

```bash
cd sharemeal-frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 🧪 Testing

Run tests:

```bash
mvn test
```

For a specific service:

```bash
cd auth-service
mvn test
```

---

# 📌 Project Status

## Completed

- Microservices Architecture
- Eureka Service Discovery
- Config Server
- API Gateway
- JWT Authentication
- OpenFeign Communication
- Food Management
- Claim Management
- Kafka Integration
- Notification System
- Food Expiry Scheduler
- Restaurant Rating System
- City-Based Food Search
- Top Donors Leaderboard
- React Frontend
- PostgreSQL Integration

---

# 🔮 Future Enhancements

- Food Image Upload
- Google Maps Integration
- Distance-Based Search
- Email Notifications
- SMS Notifications
- Docker Deployment
- Kubernetes Deployment
- Centralized Logging
- Distributed Tracing
- Monitoring Dashboard
- Analytics & Reporting

---

# 🏆 Project Highlights

### 🥇 Top Donors Leaderboard

Recognizes the most impactful donors based on donation activity and community contribution.

### 📍 City-Based Food Search

Allows NGOs to quickly discover food donations within their city.

### ⭐ Restaurant Rating System

Provides transparency and quality insights for food providers.

### 🔔 Kafka-Based Notifications

Real-time event-driven notifications using Apache Kafka.

### 🏗️ Microservices Architecture

Built using Spring Boot, Spring Cloud Gateway, Eureka, Config Server, OpenFeign, Kafka, and PostgreSQL.

---

# 👨‍💻 Author

**Harshul Sengar**

Built using Spring Boot Microservices, Spring Cloud, Kafka, PostgreSQL, JWT Authentication, React, TypeScript, OpenFeign, Eureka, and Config Server.

---

# ⭐ ShareMeal

### Donate Food. Reduce Waste. Feed Communities.