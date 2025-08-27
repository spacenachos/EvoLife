
# Evolution Simulation

A 3D evolution simulation built with React, Three.js, and TypeScript that demonstrates predator-prey dynamics in a virtual ecosystem. Watch as creatures evolve through genetic algorithms, adapting their traits like speed, size, energy, and behavior over generations.

## 🌟 Features

### Core Simulation
- **Real-time 3D visualization** using React Three Fiber and Three.js
- **Genetic algorithm system** with trait inheritance, crossover, and mutation
- **AI behavior system** managing creature states (hunting, fleeing, eating, reproducing)
- **Dynamic ecosystem** with predator-prey interactions and food spawning
- **Evolution tracking** with real-time statistics and population metrics

### Interactive Controls
- **Visual node editor** for real-time parameter adjustment
- **Simulation controls** with play/pause, reset, and speed adjustment
- **3D camera controls** with WASD movement and mouse look
- **Statistics dashboard** showing population dynamics and evolutionary progress

### Technical Features
- **Performance optimized** with RequestAnimationFrame-based game loop
- **Efficient rendering** with delta time calculations and filtered entity management
- **Shadow mapping** and lighting effects for visual realism
- **Responsive UI** with Tailwind CSS and Radix UI components

## 🚀 Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or equivalent package manager

### Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Open your browser:**
Navigate to `http://localhost:5000` to view the simulation.

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes (if using database)

## 🎮 How to Use

### Camera Controls
- **WASD** or **Arrow Keys**: Move camera forward/back/left/right
- **Q/E**: Move camera up/down
- **Mouse**: Look around (click and drag)

### Simulation Controls
- **Play/Pause**: Start or stop the simulation
- **Reset**: Restart with a new population
- **Speed Slider**: Adjust simulation speed (0.1x to 5.0x)

### Node Editor
Use the visual node editor to adjust simulation parameters in real-time:

#### AI Behavior Tab
- **Hunt Range**: How far predators can detect prey
- **Hunt Speed**: Speed multiplier when hunting
- **Flee Speed**: Speed multiplier when fleeing
- **Fear Sensitivity**: How easily prey gets scared

#### Environment Tab
- **Food Spawn Rate**: How often new food appears
- **Food Energy**: Energy value of each food item
- **Energy Decay**: How fast creatures lose energy

#### Population Tab
- **Max Predators**: Maximum number of predators
- **Max Prey**: Maximum number of prey creatures

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # Reusable UI components
│   │   │   ├── Camera.tsx  # 3D camera controls
│   │   │   ├── Creature.tsx # Creature rendering
│   │   │   ├── Environment.tsx # 3D environment
│   │   │   ├── Food.tsx    # Food item rendering
│   │   │   ├── Lights.tsx  # Scene lighting
│   │   │   ├── NodeEditor.tsx # Parameter editor
│   │   │   ├── SimulationControls.tsx # Control panel
│   │   │   └── Statistics.tsx # Stats display
│   │   ├── lib/
│   │   │   ├── stores/     # Zustand state management
│   │   │   ├── ai.ts       # AI behavior logic
│   │   │   ├── genetics.ts # Genetic algorithm
│   │   │   └── types.ts    # TypeScript definitions
│   │   └── App.tsx         # Main application
│   └── public/             # Static assets
├── server/                 # Express.js backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Data storage
└── shared/                # Shared TypeScript types
```

## 🧬 How Evolution Works

### Genetic Traits
Each creature has genetic traits that influence their behavior:
- **Speed**: Movement speed
- **Size**: Physical size affecting collision and visibility
- **Energy**: Starting energy and efficiency
- **Aggression**: Hunting behavior intensity
- **Fear**: Tendency to flee from threats

### Evolution Process
1. **Selection**: Creatures with better survival and reproduction rates are more likely to pass on their genes
2. **Crossover**: Offspring inherit traits from both parents
3. **Mutation**: Random trait variations introduce genetic diversity
4. **Adaptation**: Over generations, populations adapt to environmental pressures

### Behavioral States
- **Wandering**: Default exploration behavior
- **Hunting**: Predators actively pursue prey
- **Fleeing**: Prey escape from nearby predators
- **Eating**: Consuming food to restore energy
- **Reproducing**: Creating offspring when energy is sufficient

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Three.js** with React Three Fiber for 3D rendering
- **Zustand** for state management
- **Tailwind CSS** with Radix UI for styling
- **Vite** for build tooling

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations (optional)
- **In-memory storage** for development

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for fast bundling
- **PostCSS** with Autoprefixer

## 🔧 Configuration

The simulation can be configured through the node editor interface or by modifying the configuration in the codebase. Key parameters include:

- Population limits and spawn rates
- Energy and food systems
- Creature behavior parameters
- Environmental constraints
- Genetic algorithm settings

## 📊 Performance

The simulation is optimized for smooth real-time performance:
- **60 FPS target** with delta time-based updates
- **Efficient collision detection** using spatial partitioning
- **Optimized rendering** with frustum culling and LOD
- **Memory management** with object pooling for creatures and food

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the package.json file for details.

## 🎯 Future Enhancements

- Advanced genetic traits and behaviors
- Environmental hazards and challenges
- Data export and analysis tools
- Multiplayer simulation sharing
- AI neural network integration
- Enhanced visual effects and animations

---

Enjoy exploring the fascinating world of digital evolution! 🧬✨
