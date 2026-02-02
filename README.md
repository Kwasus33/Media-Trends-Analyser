# Media Trends Analyzer

## Project Demo

https://github.com/user-attachments/assets/ea745338-5183-44e2-8f24-aa33a688e812

## Team

- Miłosz Andryszczuk
- Jakub Kwaśniak
- Michał Pędziwiatr
- Kacper Siemionek

## About the Project

Media Trends Analyzer is a system designed to monitor, aggregate, and analyze news narratives from various public internet sources.

The application uses Large Language Models (currently Gemini) to generate daily event summaries. It allows users to track how media narratives evolve regarding specific topics (like Politics or Technology) through interactive charts and generated reports.

## Key Features

- **Automated Data Aggregation:** The system consumes public RSS feeds (TVN24, Interia, Gazeta Wyborcza) and the BBC API to gather news metadata.
- **AI Analysis:** Uses LangChain agents to categorize content and generate unbiased daily summaries.
- **Custom Reports:** Users can select specific date ranges to generate detailed trend analysis.
- **Data Visualization:** Interactive charts illustrating topic popularity trends over time.
- **Microservices Architecture:** Modular design built with Docker for scalability.

## Tech Stack

**Frontend**

- Next.js (React)
- TypeScript
- Tailwind CSS

**Backend & AI**

- Python 3.12
- FastAPI
- LangChain
- uv

**Infrastructure & Data**

- PostgreSQL
- Docker & Docker Compose
- Traefik
- GitHub Actions

## System Architecture

The system consists of independent microservices:

1. **Data Ingestion Service:** Aggregates data from external RSS feeds and APIs.
2. **Agent Service:** Handles AI logic, summarization, and text processing.
3. **Database:** Stores metadata and generated summaries.
4. **API Gateway:** Manages traffic and security.
5. **Browser Client:** The user interface.

## How to Run Locally

### Prerequisites

- Docker & Docker Compose installed.
- **Node.js & npm** (required to run the Client).

### 1. Setup & Configuration

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Kwasus33/Media-Trends-Analyser
    cd Media-Trends-Analyser
    chmod +x scripts/*.sh
    ```

2.  **Configure Environment Variables:**

    The project uses `.env.example` files as templates. You need to copy them to `.env` files and fill in the secrets.

    **A. Root Configuration:**
    Create a `.env` file in the root directory (required for API Gateway security).

    ```env
    VM_SECRET=your_secret_key_here
    ```

    **B. Services Configuration:**
    Run the following commands to create config files from templates:

    ```bash
    cp services/data-scraper-service/.env.example services/data-scraper-service/.env
    cp services/agent-service/.env.example services/agent-service/.env
    ```

    > **Important:** To generate _new_ reports using AI, you must add a valid `GOOGLE_API_KEY` inside `services/agent-service/.env`.

    **C. Client Configuration:**
    Create a `.env` file inside the `client` directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost
    VM_SECRET=your_secret_key_here
    ```

### 2. Run the Backend (Docker)

We provide utility scripts to automatically handle database setup and Docker networking. Choose one of the modes below:

**Option A: Run with Demo Data (showcase)**
Starts the system pre-populated with archival data (January 2026).

```bash
./scripts/run_demo.sh
```

**Option B: Run with Empty Database (fresh system ready for new data scraping).**

```
./scripts/run_clean.sh
```

### 3. Run the Client (Frontend)

Open a new terminal, navigate to the client directory:

```bash
cd client
npm install
npm run dev
```

_The application interface will be available at `http://localhost:3000`._

**Troubleshooting:** If you switch between Demo and Clean modes and see incorrect data, clear the Next.js cache and restart the client:

```bash
rm -rf .next
npm run dev
```

## Legal Disclaimer

This project was created strictly for educational and academic purposes at the Warsaw University of Technology. It is a Proof of Concept developed for academic evaluation that utilizes Text and Data Mining principles for research purposes. The application does not store full articles permanently nor redistribute raw copyrighted content. All analysis is performed on public RSS feeds and APIs.
