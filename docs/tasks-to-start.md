# Initial Task List for T3 Stack Game List Application

## 1. **Project Initialization**
- Set up the project using `create-t3-app`
- Configure MongoDB connection (get connection string, set up `.env`, test Prisma connection)

## 2. **Prisma Schema Definition**
- Define the `Game` model in `schema.prisma` with all required fields
- Push schema to MongoDB (`prisma db push`)

## 3. **Seed Script for Mock Data**
- Set up Prisma seed script (`prisma/seed.ts`)
- Integrate faker package for generating mock game data
- Generate and insert at least 1,000 game records

## 4. **tRPC Router Setup**
- Create base tRPC router (`src/server/api/routers/game.ts`)
- Set up procedure for listing games (with pagination)
- Add Zod validation for query parameters

## 5. **Game Creation Endpoint**
- Implement tRPC mutation to add a game
- Validate input using Zod schema
- Test endpoint with example payload

## 6. **Release Year Range Aggregation Endpoint**
- Implement tRPC query for release year range stats
- Use Prisma aggregation to compute count, average price, highest/lowest metascore per genre
- Validate input with Zod

## 7. **Frontend Table Display**
- Create a page/component that fetches and displays games in a table (minimal UI)
- Integrate pagination (either backend or frontend)

## 8. **Documentation**
- Add basic setup and usage instructions to `README.md`

---

**Start with these tasks in order. If you finish early, move on to optional features (filtering, sorting, authentication, testing).**