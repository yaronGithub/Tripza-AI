# Tripza AI 🗺️

A sophisticated AI-powered trip planning application that generates personalized travel itineraries with intelligent route optimization.

## Features

### Core Functionality
- **Smart AI Itinerary Generation**: OpenAI-powered daily plans based on your preferences
- **Interactive Maps**: Visual route planning with optimized paths
- **Preference Matching**: Customize trips based on attraction types you love
- **Route Optimization**: Minimize travel time with geographic clustering
- **User Authentication**: Secure accounts for saving and sharing plans

### Advanced Features
- **Plan Sharing**: Share trips publicly or with specific users
- **Collaborative Planning**: Work together on group trips
- **Real-time Updates**: Live attraction data and recommendations
- **Mobile Optimization**: Seamless experience across all devices

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tripza-ai.git
cd tripza-ai
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Usage

### Creating Your First Trip

1. **Enter Trip Details**: Specify your destination and travel dates
2. **Select Preferences**: Choose attraction types that interest you
3. **Generate Itinerary**: Let Tripza AI create your optimized daily plans
4. **View on Map**: See your attractions and routes visualized
5. **Save & Share**: Keep your plans and share with friends

### Customizing Your Itinerary

- **Reorder Activities**: Drag and drop to adjust your daily schedule
- **Add Attractions**: Search and add specific points of interest
- **Remove Items**: Remove attractions that don't fit your plans
- **Adjust Timing**: Modify how long you spend at each location

## Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI Integration**: OpenAI GPT-4o-mini for intelligent planning
- **Maps**: Google Maps API with Leaflet fallback
- **Database**: Supabase for user data and trip storage
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages/views
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── services/           # API services and integrations
├── data/               # Mock data and constants
└── styles/             # Global styles and themes
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and commit: `git commit -m 'Add amazing feature'`
4. Push to your branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for AI-powered trip planning
- Google Maps for mapping and directions
- Unsplash and Pexels for beautiful travel images
- Lucide for beautiful icons
- The React and Tailwind CSS communities

## Contact

- Project Homepage: [https://tripza.ai](https://tripza.ai)
- Report Issues: [GitHub Issues](https://github.com/yourusername/tripza-ai/issues)
- Email: support@tripza.ai

---

Built with ❤️ for travelers by travelers