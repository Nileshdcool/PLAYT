# T3 Stack Game List Application - Development Plan

## 1. **Project Setup**
- Scaffold a new project using [`create-t3-app`](https://create.t3.gg/).
- Select features:
  - **Next.js** (frontend)
  - **tRPC** (API layer)
  - **Prisma** (ORM for MongoDB)
  - **TailwindCSS** (UI, even if minimal)
  - **Zod** (validation)
  - **(Optional) Authentication/role system** (if time allows)

## 2. **Prisma & MongoDB Schema**
- Configure Prisma to use MongoDB (update `schema.prisma` datasource).
- Define the `Game` model, mapping all specified fields:
  ```prisma
  model Game {
    id           String   @id @default(auto()) @map("_id")
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
- Run `prisma db push` to sync schema.

## 3. **Mock Data Generation (Seeding)**
- Create a `prisma/seed.ts` script to generate **at least 1,000 mock games**:
  - Use faker libraries (e.g. `@faker-js/faker`) for realistic data.
  - Ensure diversity in genres, platforms, developers, releaseYears, prices, etc.
- Run the seed script (`npx prisma db seed`) and verify data in MongoDB.

## 4. **Backend API with tRPC**
- **Game Listing Endpoint**
  - Create a tRPC router to fetch games from the database.
  - Implement pagination for large data sets (e.g., page/limit, cursor).
  - Add Zod validation to query parameters.
- **Add Game Endpoint**
  - tRPC mutation to accept game data, validate with Zod schema, and insert into DB.
  - Return success/error states.
- **Release Year Range Aggregation Endpoint**
  - tRPC query: accepts releaseYear A & B.
  - Returns for each genre:
    - Count of games
    - Average price
    - Highest & lowest metascore
  - Use Prisma aggregation queries.

## 5. **Data Validation**
- Use **Zod** schemas for all endpoints:
  - Validate incoming game data (types, required fields, value ranges).
  - Validate query params (release year range, pagination inputs).

## 6. **Efficient Data Handling**
- **Backend:**
  - Use pagination/cursor-based queries for listing games.
  - Use Prisma aggregations for statistics.
- **Frontend:**
  - Use a fast table library (e.g. [react-table](https://tanstack.com/table/v8) or [Material UI Table](https://mui.com/material-ui/react-table/)), even if basic.
  - Display paged data with minimal UI effort.

## 7. **Optional Features (Time Permitting)**
- **Filtering & Sorting:** Add query params for genre, platform, release year, etc.
**Authentication/Role System:** Add if time allows, restrict endpoints based on roles.
- **Testing:** Add unit tests for API endpoints (tRPC).
- **Frontend Improvements:** Better UI/UX with Tailwind and table features.

## 8. **Timeline Breakdown (4 Hours)**
| Task                       | Est. Time  |
|----------------------------|------------|
| Project Setup              | 20 min     |
| Prisma Schema & DB Config  | 20 min     |
| Seed Script & Mock Data    | 40 min     |
| tRPC API Endpoints         | 60 min     |
| Zod Validation             | 15 min     |
| Pagination & Aggregation   | 30 min     |
| Minimal UI Table           | 30 min     |
| Optional Features/Polish   | 25 min     |

## 9. **Delivery & Documentation**
- Prepare a README with setup, seed instructions, and API usage.
- Be ready to explain code choices, especially around:
  - Data model design
  - Validation logic
  - Efficient querying/pagination/aggregation
  - Any package additions

---

## **Prioritization**
1. Core backend logic: Prisma schema, seed, tRPC endpoints, validation, aggregation.
2. Efficient data handling: Pagination, aggregation queries.
3. Minimal UI for demonstration.
4. Optional features if time remains: filtering/sorting, auth, tests.

---

**Tip:** Focus on well-structured backend. If you run out of time, ensure the API endpoints work and seed script runs—UI can be basic.
