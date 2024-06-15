# The Spring Library

The Spring Library is a Java-based web application that provides a library management system. It is built with Spring Boot and uses MySQL for data storage. The application also integrates with Stripe for payment processing and Okta for user authentication.

## Architecture Diagram

```plaintext

+------------------------------------------+
|            Spring Library                |
|              Application                 |
+------------------------------------------+
|                                          |
|   +----------------------------------+   |
|   |       Frontend (React)           |   |
|   |   TypeScript, CSS, Axios         |   |
|   +----------------------------------+   |
|                                          |
|   +----------------------------------+   |
|   |       Backend (Spring Boot)      |   |
|   |  Controllers, Services, DAO      |   |
|   |       Entities, Utils            |   |
|   +----------------------------------+   |
|                                          |
|   +----------------------------------+   |
|   |   Authentication (Okta)          |   |
|   +----------------------------------+   |
|                                          |
|   +----------------------------------+   |
|   |   Payment Processing (Stripe)    |   |
|   +----------------------------------+   |
|                                          |
|   +----------------------------------+   |
|   |      Database (MySQL)            |   |
|   |  Users, Books, Transactions      |   |
|   +----------------------------------+   |
|                                          |
+------------------------------------------+



```

## Features
### User Management

- User Authentication
- Roles and Permissions (through Okta)

### Book Management

- Book Catalog
- Search Functionality
- Book Details
- Pagination

### Transaction Management

- Borrow Books
- Return Books
- Transaction History

### Payment Processing

- Stripe Integration
- Payment History

### Administrative Features

- Book Inventory Management
- User Management
- Transaction Monitoring

### Additional Features

- Responsive Design with Bootstrap
- API Security