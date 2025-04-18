# Competition Voting System Backend

A robust backend system for managing competitions and voting, built with Node.js, Express, and Prisma.

## 🚀 Features

- **User Management**
  - User registration and authentication
  - Role-based access control (Regular User, Super Admin)
  - JWT-based authentication

- **Competition Management**
  - Create, read, update, and delete competitions
  - Set competition duration (start and end dates)
  - Track competition status (active/inactive)

- **Option Management**
  - Add options (candidates) to competitions
  - Update and delete options
  - Track option vote counts

- **Voting System**
  - Vote for options in active competitions
  - Prevent multiple votes per user
  - Real-time vote counting

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Validation**: Express Validator

## 📦 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## 🔧 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/competition_db"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

4. Set up the database
```bash
npx prisma migrate dev
```

5. Start the server
```bash
npm start
```

## 📚 API Documentation

The API documentation is available at `/api-docs` when the server is running. It includes:

- Authentication endpoints
- User management
- Competition management
- Option management
- Voting system

## 🔐 Authentication

All routes (except login/register) require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 👥 User Roles

1. **Regular Users**
   - Create and manage their own competitions
   - Add options to their competitions
   - Vote in active competitions
   - View all competitions

2. **Super Admin**
   - View all competitions with full details
   - Delete any competition
   - Manage user roles

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Competitions
- `POST /api/competitions` - Create competition
- `GET /api/competitions` - Get all competitions
- `GET /api/competitions/:id` - Get single competition
- `PUT /api/competitions/:id` - Update competition
- `DELETE /api/competitions/:id` - Delete competition

### Options
- `POST /api/competitions/:id/options` - Add option
- `PUT /api/competitions/:id/options/:optionId` - Update option
- `DELETE /api/competitions/:id/options/:optionId` - Delete option
- `POST /api/competitions/:id/options/:optionId/vote` - Vote for option

### Admin
- `GET /api/admin/competitions` - Get all competitions (admin view)
- `DELETE /api/admin/competitions/:id` - Delete any competition

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 📊 Database Schema

The database schema includes:
- Users
- Competitions
- Options
- Votes

See `prisma/schema.prisma` for details.

## 🔄 Development Workflow

1. Create feature branch
2. Make changes
3. Run tests
4. Create pull request
5. Code review
6. Merge to main

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email divinejohn65@gmail.com or create an issue in the repository. 