# Modern Jenkins Dashboard

A modern, responsive web application for monitoring and analyzing Jenkins jobs and pipelines. Built with React, TypeScript, Tailwind CSS, and other contemporary technologies.

## ✨ Features

- **📊 Real-time Dashboard**: Live monitoring of Jenkins jobs with auto-refresh
- **🔍 Advanced Filtering**: Search, filter by status, folder, ownership, and more
- **📈 Analytics & Insights**: Interactive charts and performance metrics
- **🧹 Cleanup Recommendations**: Identify test jobs, inactive jobs, and disabled pipelines
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **⚡ Modern Tech Stack**: React 18, TypeScript, Tailwind CSS, React Query
- **🎨 Beautiful UI**: Clean, professional interface with smooth animations
- **📊 Data Visualization**: Interactive charts using Recharts
- **🔄 Real-time Updates**: Auto-sync with Jenkins API
- **📤 Export Functionality**: Download data as CSV

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack React Query for server state
- **Data Tables**: TanStack React Table with sorting and pagination
- **Charts**: Recharts for data visualization
- **UI Components**: Headless UI for accessible components
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Date Handling**: date-fns

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jenkins-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Jenkins Configuration (for backend)
JENKINS_BASE_URL=https://your-jenkins-instance.com/
JENKINS_USER=your-jenkins-username
JENKINS_TOKEN=your-jenkins-api-token

# Dashboard Settings
VITE_DASHBOARD_TITLE=Jenkins Dashboard
VITE_REFRESH_INTERVAL=300000
VITE_ITEMS_PER_PAGE=25
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── analytics/      # Analytics and chart components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and API client
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## 🎨 Design System

The application uses a comprehensive design system built with Tailwind CSS:

- **Colors**: Primary, success, warning, error color palettes
- **Typography**: Consistent font sizes and weights
- **Spacing**: 8px grid system
- **Components**: Reusable UI components with consistent styling
- **Animations**: Smooth transitions and micro-interactions

## 📊 Features Overview

### Dashboard Overview
- **KPI Cards**: Total jobs, success rates, build durations
- **Advanced Filtering**: Multi-select filters with search
- **Data Table**: Sortable, paginated job listings
- **Real-time Sync**: Manual and automatic data refresh

### Analytics
- **Status Distribution**: Pie chart showing build status breakdown
- **Build Duration Analysis**: Bar chart comparing folder performance
- **Performance Insights**: Key metrics and trends

### Cleanup Insights
- **Test Job Detection**: Identify development/testing jobs
- **Inactive Job Analysis**: Find jobs not built recently
- **Disabled Job Tracking**: List disabled pipelines
- **Cleanup Recommendations**: Actionable suggestions

## 🔌 API Integration

The application is designed to work with a REST API backend. In development mode, it uses mock data for demonstration purposes.

### API Endpoints Expected:
- `GET /api/jobs` - Fetch all Jenkins jobs
- `GET /api/stats` - Get dashboard statistics
- `POST /api/sync` - Trigger data sync from Jenkins
- `GET /api/jobs/:name` - Get specific job details

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
The application is ready for deployment to modern hosting platforms:

1. **Vercel**: Connect your repository and deploy automatically
2. **Netlify**: Drag and drop the `dist` folder or connect via Git
3. **Docker**: Use the included Dockerfile for containerized deployment

## 🔄 Migration from Streamlit

This modern React application replaces the original Streamlit Python application with:

- **Better Performance**: Client-side rendering and caching
- **Modern UX**: Responsive design and smooth interactions
- **Real-time Updates**: WebSocket support and auto-refresh
- **Extensibility**: Component-based architecture for easy customization
- **Mobile Support**: Works perfectly on all device sizes

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (recommended)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using modern web technologies**