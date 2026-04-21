# Greenhouse Monitor

A real-time greenhouse monitoring dashboard built with Next.js 15, Supabase, and Tailwind CSS for a takehome assignment.

<img width="1709" height="659" alt="image" src="https://github.com/user-attachments/assets/84c3cd90-18d1-47b9-a076-1f4187e402b9" />

## Getting Started

### Prerequisites

- Node.js 24x
- npm or yarn
- Supabase Account Project setup

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure your `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url // Settings -> Data API -> API URL (Remove the suffix rest/v1/)
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key // Settings -> API Keys -> Legacy -> ANON_PUBLIC
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key // Settings -> API Keys -> Legacy -> SERVICE_ROLE
   ```

5. Set up the database:
   - Run the SQL schema in your Supabase SQL Editor
   ```
    CREATE TABLE sensor_readings (
    id          SERIAL PRIMARY KEY,
    device_id   TEXT        NOT NULL,
    location    TEXT        NOT NULL,
    temperature REAL        NOT NULL,
    humidity    REAL        NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW()
    );
   ```
   - Enable read access (RLS policy)
   ```
    CREATE POLICY "Allow public read" ON sensor_readings
    FOR SELECT USING (true);
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

### Running the Simulator

To test data ingestion, run the simulator:
```bash
INGEST_URL=http://localhost:3000/api/ingest node simulator.js
```

---

## Some Architecture & Technical Decisions

### 1. Server vs Client Components

**Decision:** Hybrid approach: Server Component fetches initial data, Client Component handles polling later.

### 2. Supabase Client Strategy

**Decision:** Two separate clients - one for server (using service role key), one for browser (using anon key).

### 3. Lazy-Loaded Trends Tab

**Decision:** Trends page loads data only when tab is clicked so as to not have a bigger initial page load.

### 4. In-Memory Aggregation in API Routes

**Decision:** Stats calculated in next rather than using PostgreSQL aggregation functions. Would have taken more time and seem like a cleaner way to approach this.

### 5. Color-Coded Status System

**Decision:** Per-metric status (temp/humidity separately) vs overall sensor status so that the end user can see which exact metric is out of range(used sane defaults).
And has a visual cue per card too.

---

## How the project went end to end/ Procedure Followed
This was supposed to be capped at 4-5 hours. It took me ~3.5 - 4 hours to finish the project(Minus the deployment/Readme/Video)

This was the rough timeline I followed to implement this project.

- Next Js learning basics/ Refresher
- Understanding project requirements and planning the project into smaller stages
- Project Scaffolding/ Setup
- Data Ingestion Stuff
- Dashboard UI
- Deployment (Vercel was causing issues, so ended up deploying to Netlify. Will look into this later.)

---

## AI Tools Used

This project was developed with more AI assistance than I would have honestly liked mostly because of the lack of NextJs experience on my side.

I used AI for initial understanding of the project and scoping the project into smaller stages with GLM 5.
Then used claude as an assistant on queries regarding best practices and validating the strategies in my mind.
For the coding part I wanted to try OpenCode for this, so ended up learning how it works as well. Used Big Pickle as the coding model which is decent enough in my opinion for
intermediate level tasks.

---

## Future Improvements

With an additional 5 hours, I would probably scope features into priority levels and see how to approach them. But these are the things which come to my mind right now:

1. **Add time range selector** - Allow users to filter trends by 1hr, 24hr, 7d

2. **Add loading skeletons/UI improvements** - Better UX during data fetches/ Or generally make the UI more appealing for the end user.

3. **CSV export** - Allow users to download raw readings for a selected sensor and time range.

4. **Feature to ensure a data retention policy** - The readings table will grow indefinitely in the current setup so a monthly cron job could aggregate older 
   data into a summary report, export it, and prune the raw rows to keep the database smaller/learner.But this might take longer to implement.

---

## Tradeoffs Made

| Area | Tradeoff | Why |
|------|----------|-----|
| Polling vs WebSockets | Chose polling (6s interval) | Simpler implementation, sufficient for this demo |
| Single chart vs separate | Separate temp/humidity charts | Better readability so its easier to read values |
| Hardcoded thresholds | Not configurable via UI | Time constraint - very easy to change in code |
---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── ingest/         # POST endpoint for sensor data
│   │   └── trends/         # Stats and history endpoints
│   ├── page.tsx            # Main server component
│   └── layout.tsx          # Root layout
├── components/
│   ├── DashboardClient.tsx # Tab switching logic
│   ├── SensorCard.tsx      # Individual sensor display
│   ├── SensorGrid.tsx      # Dashboard grid with polling
│   ├── TrendChart.tsx      # Recharts line chart
│   ├── TrendStatsCard.tsx  # Min/max/avg stats
│   └── TrendsView.tsx      # Trends tab container
├── lib/
│   ├── config.ts           # Constants and thresholds
│   ├── env.ts              # Environment validation
│   ├── sensors/
│   │   ├── status.ts       # Status calculation logic
│   │   └── types.ts        # Shared TypeScript types
│   └── supabase/
│       ├── client.ts       # Browser client
│       └── server.ts       # Server client
└── simulator.js            # Test data generator provided in the test file
```

---
