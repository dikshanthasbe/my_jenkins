# Jenkins Dashboard

A comprehensive Streamlit application for monitoring and analyzing Jenkins jobs and pipelines with advanced insights and cleanup recommendations.

## Features

- **📊 Dashboard Overview**: Real-time monitoring of all Jenkins jobs and pipelines with success/failure rates
- **🧹 Cleanup Insights**: Identify test jobs, inactive jobs (>60 days), and disabled pipelines for cleanup
- **📈 Advanced Analytics**: Build duration analysis, performance insights, and outlier detection
- **🔍 Smart Filtering**: Search by job name, folder, or status with multi-select filters
- **📱 Modern UI**: Clean, professional interface with responsive design
- **💾 Database Support**: PostgreSQL (production) and SQLite (development) for flexible data storage
- **🔄 Data Sync**: Manual refresh capability with confirmation modal
- **📊 Visualizations**: Interactive charts and graphs for data analysis
- **📋 Export Functionality**: Download data in CSV format

## Project Structure

```
Jenkins_Dashboard/
├── src/
│   ├── config.py         # Configuration management with environment variables
│   ├── data_manager.py   # Database operations (PostgreSQL/SQLite)
│   ├── postgres_manager.py # PostgreSQL-specific database operations
│   ├── jenkins_api.py    # Jenkins API communication and data fetching
│   └── ui.py             # Streamlit UI components and visualizations
├── db/
│   └── init/
│       └── 01_init.sql   # PostgreSQL database initialization script
├── docker-compose.yml    # Docker services (PostgreSQL + pgAdmin)
├── .env                  # Environment variables (not in git)
├── .env.example          # Environment variables template
├── main.py               # Application entry point
├── pyproject.toml        # Project dependencies and metadata
├── README.md             # This file
├── CONFIGURATION.md      # Detailed configuration guide
└── .gitignore           # Git ignore rules
```

## Quick Start

### Prerequisites
- **Python 3.10+** and **uv** for package management
- **Docker** and **Docker Compose** for PostgreSQL (optional)
- Follow the instructions for installing uv: https://docs.astral.sh/uv/getting-started/installation/

### Option 1: PostgreSQL (Recommended for Production)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Jenkins_Dashboard
   ```

2. **Install dependencies:**
   ```bash
   uv sync
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your Jenkins credentials and PostgreSQL configuration
   ```

4. **Start PostgreSQL database:**
   ```bash
   docker-compose up -d postgres
   ```

5. **Run the application:**
   ```bash
   uv run streamlit run main.py
   ```

### Option 2: SQLite (Development)

1. **Follow steps 1-3 above**

2. **Set database type to SQLite in .env:**
   ```bash
   DB_TYPE=sqlite
   ```

3. **Run the application:**
   ```bash
   uv run streamlit run main.py
   ```

### Database Management (Optional)
- **pgAdmin**: Access at http://localhost:8080 (admin@jenkins-dashboard.com / admin_password_2024)
- **Direct access**: `docker exec jenkins_dashboard_db psql -U jenkins_user -d jenkins_dashboard`

## Testing Connectivity

Before running the full application, you can test your Jenkins connectivity to ensure everything is configured correctly.

### Connectivity Test Script

The project includes a connectivity test script that verifies:
- **Basic connectivity** to your Jenkins server
- **Authentication** with your credentials
- **User information** retrieval
- **JobConfigHistory plugin** availability (for "Last Editor" functionality)

#### Run the Test:

```bash
# Test connectivity before running the app
uv run python test_connectivity.py
```

#### Expected Output:

```
🔍 Testing Jenkins Connectivity...
==================================================
📍 Jenkins URL: http://your-jenkins.com:8080
👤 Username: your-username
🔑 Token: ********...

1️⃣ Testing basic connectivity with authentication...
✅ Basic connectivity: SUCCESS
   📊 Jenkins Version: 2.176.1
   🏗️  Total Jobs: 450

2️⃣ Testing user information...
✅ User info: SUCCESS
   👤 Full Name: Your Full Name
   📧 Email: your.email@company.com

3️⃣ Testing JobConfigHistory plugin...
✅ JobConfigHistory plugin: AVAILABLE
   ✏️ Last Editor functionality will work

==================================================
🎉 Connectivity test completed!
✅ Your Jenkins is ready for the dashboard!
🚀 You can now run: uv run streamlit run main.py
```

#### Troubleshooting:

- **Connection errors**: Check your Jenkins URL and network connectivity
- **Authentication failures**: Verify your username and API token
- **Missing JobConfigHistory**: The "Last Editor" column will show fallback data

```

## Key Features Explained

### 📊 Dashboard Overview
- **KPI Cards**: Total jobs, success rate, failure rate, average build duration
- **Build Status Distribution**: Visual breakdown of job statuses
- **Jobs by Folder**: Distribution of jobs across folders
- **Interactive Data Table**: Sortable, filterable job list with pagination

### 🧹 Cleanup Insights
- **Test Jobs**: Identifies jobs with test-related keywords (excluding common words)
- **Inactive Jobs**: Shows jobs not triggered for configurable days (default: 60)
- **Disabled Jobs**: Lists all disabled pipelines
- **Cleanup Recommendations**: Actionable suggestions for each job type

### 📈 Advanced Analytics
- **Build Duration Analysis**: Statistical analysis of build times
- **Outlier Detection**: Identifies jobs with unrealistic build durations
- **Performance Insights**: Success rate trends and build frequency analysis
- **Description Analysis**: Job documentation quality and coverage metrics

## Dependencies

- **Streamlit** (>=1.46.1): Web application framework
- **Pandas** (>=2.3.1): Data manipulation and analysis
- **Plotly** (>=6.2.0): Interactive visualizations
- **Requests** (>=2.32.4): HTTP requests for Jenkins API
- **Python-dotenv** (>=1.1.1): Environment variable management
- **psycopg2-binary** (>=2.9.9): PostgreSQL database adapter (for PostgreSQL mode)

## Reusability

This codebase is designed to be reused for different Jenkins instances. Simply update the `.env` file with different credentials and dashboard titles for each Jenkins server. See [CONFIGURATION.md](CONFIGURATION.md) for detailed examples.

## Support

For detailed configuration options and troubleshooting, see [CONFIGURATION.md](CONFIGURATION.md).
