# DreamGarden Web App 🌱

A comprehensive web application that brings your iOS DreamGarden app to the web with all the same features and more! Built with Next.js, React, and modern web technologies.

## ✨ Features

### 🌿 Garden Management
- **Garden Beds**: Create and manage multiple garden beds with detailed information
- **Plant Tracking**: Add plants to beds with planting dates, harvest dates, and notes
- **Task Management**: Create, track, and manage garden tasks with priorities and due dates
- **Budget Tracking**: Monitor garden expenses and income with detailed analytics

### 🤖 AI Assistant (Cultivar)
- **Unlimited AI Chat**: Get expert gardening advice from our AI assistant
- **Plant Identification**: Upload photos to identify plants and detect health issues
- **Weather Integration**: AI provides weather-aware gardening recommendations
- **Conversation History**: Save and manage multiple AI conversations
- **Usage Tracking**: Monitor AI usage with detailed statistics

### 🌤️ Weather Features
- **Current Weather**: Real-time weather data for your location
- **4-Day Forecast**: Detailed weather predictions
- **Weather History**: Track weather patterns over time (Premium)
- **Weather Alerts**: Get notified of extreme weather conditions
- **AI Weather Insights**: Personalized weather recommendations

### 💎 Premium Features
- **Unlimited AI Usage**: No limits on AI chat and weather suggestions
- **166,667 Monthly Tokens**: Generous token allowance for all AI features
- **Advanced Analytics**: Detailed garden performance metrics
- **Weather History**: 6 months of historical weather data
- **Plant Identification**: Advanced plant and disease detection
- **Budget Analytics**: Expense categorization and profit analysis

### 📊 Analytics & Insights
- **Garden Performance**: Track plant growth and garden health
- **Budget Analytics**: Monitor expenses and potential returns
- **Weather Trends**: Analyze weather patterns and their impact
- **Task Completion**: Track task completion rates and efficiency

### ⚙️ Settings & Preferences
- **API Configuration**: Secure storage of OpenAI and Weather API keys
- **Data Privacy**: Control what data is shared with AI
- **Notifications**: Customize weather and garden alerts
- **Data Management**: Clear data and reset preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- OpenWeatherMap API key (optional, for real weather data)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dreamgarden-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Required for AI features
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional for real weather data (uses demo data if not provided)
   WEATHER_API_KEY=your_openweathermap_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### GitHub Pages (Recommended)

This app is configured for static export and can be deployed to GitHub Pages:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Set up GitHub Pages**
   - Go to your repository Settings
   - Navigate to Pages section
   - Select "GitHub Actions" as source
   - The workflow will automatically deploy on push

3. **Add Environment Variables** (Optional)
   - Go to repository Settings → Secrets and variables → Actions
   - Add `OPENAI_API_KEY` and `WEATHER_API_KEY` as repository secrets
   - These will be used during build time

4. **Build for Production**
   ```bash
   npm run build
   ```

### Manual Deployment

1. **Build the static export**
   ```bash
   npm run build
   ```

2. **Deploy the `out` folder**
   - Upload the contents of the `out` folder to your web server
   - Or use any static hosting service (Netlify, Vercel, etc.)

### Other Platforms

The app can be deployed to any platform that supports static sites:
- **Netlify**: Drag and drop the `out` folder
- **Vercel**: Connect your GitHub repository
- **Railway**: Use the static site template
- **DigitalOcean App Platform**: Deploy as a static site

## 🔑 API Keys Setup

### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your environment variables

### OpenWeatherMap API Key (Optional)
1. Go to [openweathermap.org](https://openweathermap.org)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your environment variables

**Note**: If no weather API key is provided, the app will use demo weather data.

## 📱 Usage

### Getting Started
1. **Configure API Keys**: Go to Settings → API Configuration to set up your keys
2. **Enable Location**: Allow location access for accurate weather data
3. **Create Garden Beds**: Start by adding your first garden bed
4. **Add Plants**: Add plants to your beds with planting information
5. **Chat with AI**: Ask Cultivar for gardening advice and tips

### AI Assistant Tips
- Ask specific questions for better responses
- Share your garden data for personalized advice
- Use the image upload feature for plant identification
- Check usage limits in the settings

### Premium Features
- Toggle premium mode in Settings for unlimited features
- Premium features include unlimited AI usage and advanced analytics
- Token usage is tracked and displayed in the interface

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form, Zod validation
- **Notifications**: React Hot Toast
- **File Upload**: React Dropzone
- **Deployment**: GitHub Pages (Static Export)

## 📁 Project Structure

```
dreamgarden-web/
├── app/                    # Next.js app directory
│   ├── ai/                # AI Assistant page
│   ├── garden/            # Garden management page
│   ├── premium/           # Premium features page
│   ├── settings/          # Settings page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   └── Navigation.tsx     # Navigation component
├── lib/                   # Utilities and services
│   ├── services/          # API services
│   │   ├── ai.ts          # OpenAI service
│   │   └── weather.ts     # Weather service
│   └── store.ts           # Zustand store
├── .github/               # GitHub Actions
│   └── workflows/         # Deployment workflow
├── public/                # Static assets
└── package.json           # Dependencies
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production (static export)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run export` - Build and export static files

### Adding New Features
1. Create new pages in the `app/` directory
2. Add components to `components/` directory
3. Update the navigation in `components/Navigation.tsx`
4. Add new state management in `lib/store.ts`

## 🔒 Security & Privacy

- API keys are stored securely in environment variables
- All data is stored locally in the browser
- No data is shared with third parties without consent
- AI conversations are processed securely through OpenAI's API
- Static export ensures no server-side data processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify your API keys are correctly configured
3. Ensure you have the latest version of Node.js
4. Create an issue in the repository

## 🎯 Roadmap

- [ ] Image upload for plant identification
- [ ] Advanced weather analytics
- [ ] Garden bed layout designer
- [ ] Plant disease detection
- [ ] Seasonal planting calendar
- [ ] Community features
- [ ] Mobile app companion

---

**DreamGarden Web** - Your AI-Powered Garden Companion 🌱✨