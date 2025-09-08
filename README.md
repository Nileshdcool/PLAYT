# PLAYT - Game Management Application

A modern web application for managing video game collections built with Next.js, tRPC, and MongoDB.

## App Screenshots

Here are some screenshots to give you a quick glance at the PLAYT app:

<table>
   <tr>
      <td align="center">
         <img src="public/Screenshot%202025-09-08%20155304.png" alt="Screenshot 1" width="300" />
         <br />Screenshot 1
      </td>
      <td align="center">
         <img src="public/Screenshot%202025-09-08%20155342.png" alt="Screenshot 2" width="300" />
         <br />Screenshot 2
      </td>
      <td align="center">
         <img src="public/Screenshot%202025-09-08%20155356.png" alt="Screenshot 3" width="300" />
         <br />Screenshot 3
      </td>
   </tr>
</table>
## Project Overview

PLAYT is a full-stack application that allows users to manage and track video games. It features authentication, game management, and a responsive user interface built with modern web technologies.

## Tech Stack

- **Frontend:**
  - Next.js 15.2
  - React 19
  - TailwindCSS
  - React Query (Tanstack Query)

- **Backend:**
  - tRPC
  - Prisma ORM
  - MongoDB
  - NextAuth.js

## Features

- User Authentication
- Game Management (CRUD operations)
- Game List with filtering and pagination
- Responsive Design
- MongoDB Integration
- Type-safe API with tRPC

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/      # Feature-based modules
│   ├── auth/      # Authentication related code
│   └── games/     # Game management features
├── pages/         # Next.js pages
├── server/        # Backend logic and API routes
└── utils/         # Utility functions
```

## Getting Started

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm (v10 or higher)
   - MongoDB instance

2. **Environment Setup**
   ```bash
   # Create a .env file with the following variables
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Installation**
   ```bash
   npm install
   # If using Docker, start services with:
   docker-compose up -d
   ```

4. **Database Setup**
   ```bash
   npm run db:push     # Push the schema to database
   npm run db:generate # Generate Prisma client
   npx ts-node prisma/seed.js
   ```

5. **Development**
   ```bash
   npm run dev        # Start development server
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format:write` - Format code with Prettier
- `npm run db:studio` - Open Prisma Studio for database management
- `npm run typecheck` - Run TypeScript type checking

## Database Schema

The application uses MongoDB with Prisma as the ORM. The main model is:

```prisma
model Game {
    id           String   @id
    title        String
    genre        String
    platform     String
    releaseDate  DateTime
    developer    String
    price        Float
    multiplayer  Boolean
    metascore    Int
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the terms found in the LICENSE file.

# Handy scripts 

npx prisma db push

npx prisma db push
npx prisma generate
npx ts-node prisma/seed.js

## App Screenshots

Here are some screenshots to give you a quick glance at the PLAYT app:

<div align="center">
   <img src="public/Screenshot%202025-09-08%20155304.png" alt="Screenshot 1" width="600" style="margin: 10px; border-radius: 8px;" />
   <img src="public/Screenshot%202025-09-08%20155342.png" alt="Screenshot 2" width="600" style="margin: 10px; border-radius: 8px;" />
   <img src="public/Screenshot%202025-09-08%20155356.png" alt="Screenshot 3" width="600" style="margin: 10px; border-radius: 8px;" />
</div>
