# Evolution Simulation

## Overview

This project is a 3D evolution simulation built with React, Three.js, and TypeScript. The application simulates predator-prey dynamics in a virtual ecosystem where creatures evolve through genetic algorithms. Users can observe how traits like speed, size, energy, and behavioral characteristics change over generations as creatures adapt to their environment.

The simulation features real-time 3D visualization with creatures that hunt, flee, eat, and reproduce based on their genetic traits. Users can control simulation parameters and observe statistical data about population dynamics and evolutionary progress.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes (August 2025)

### Evolution Simulation Enhancements
- **Fixed creature survival issues**: Reduced energy decay rate from trait-based to fixed 0.5/second
- **Improved movement patterns**: Increased direction change frequency from 2% to 5% for better creature mobility
- **Enhanced food system**: Doubled initial food spawn, increased food energy values (25-40), and tripled spawn rate
- **Added visual node programming system**: Complete interface for real-time parameter adjustment with tabs for AI Behavior, Environment, and Population
- **Fixed UI visibility**: Updated button colors to be visible against dark backgrounds (green/red for play/pause, gray for reset)
- **Implemented dynamic parameter updates**: Real-time configuration changes through visual node editor

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the main application framework
- **Three.js with React Three Fiber** for 3D rendering and scene management
- **Zustand** for state management with subscription middleware for reactive updates
- **Tailwind CSS** with Radix UI components for styling and UI elements
- **Vite** as the build tool with custom configuration for 3D assets

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints
- **In-memory storage** implementation with interface for potential database integration
- **Development-only Vite middleware** for hot module replacement
- **Static file serving** for production builds

### Data Storage Solutions
- **Drizzle ORM** configured for PostgreSQL with schema definitions
- **Neon Database** integration via serverless connection
- **Memory-based storage** as current implementation with CRUD interface
- **User schema** with username/password authentication structure

### Core Simulation Systems
- **Genetic Algorithm System**: Handles trait inheritance, crossover, and mutation
- **AI Behavior System**: Manages creature states (hunting, fleeing, eating, reproducing)
- **Statistics Tracking**: Real-time population metrics and evolutionary progress
- **3D Scene Management**: Efficient rendering of creatures, food, and environment

### Authentication and Authorization
- **Session-based authentication** setup with connect-pg-simple for session storage
- **User management** interface with create/read operations
- **Password-based authentication** (implementation pending)

### Performance Optimizations
- **RequestAnimationFrame-based** game loop with delta time calculations
- **Efficient entity management** with filtered rendering for alive creatures
- **Texture repetition** for ground plane optimization
- **Shadow mapping** with optimized light setup

## External Dependencies

### 3D Graphics and Visualization
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Helper components and utilities for 3D scenes
- **@react-three/postprocessing**: Visual effects and post-processing
- **three**: Core 3D graphics library
- **vite-plugin-glsl**: GLSL shader support

### UI and Styling
- **@radix-ui/***: Comprehensive set of accessible UI components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### State Management and Data Fetching
- **zustand**: Lightweight state management
- **@tanstack/react-query**: Server state management and caching

### Database and ORM
- **drizzle-orm**: Type-safe ORM for PostgreSQL
- **drizzle-kit**: Database migration and schema management
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-zod**: Schema validation integration

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay