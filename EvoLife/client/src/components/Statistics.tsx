import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSimulation } from "../lib/stores/useSimulation";

export default function Statistics() {
  const { stats, isRunning, time } = useSimulation();

  const formatTime = (timeInMs: number) => {
    const seconds = Math.floor(timeInMs / 1000) % 60;
    const minutes = Math.floor(timeInMs / 60000) % 60;
    const hours = Math.floor(timeInMs / 3600000);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const chartData = useMemo(() => {
    if (stats.history.length < 2) return null;
    
    const maxDataPoints = 50;
    const step = Math.max(1, Math.floor(stats.history.length / maxDataPoints));
    const sampledHistory = stats.history.filter((_, index) => index % step === 0);
    
    return sampledHistory;
  }, [stats.history]);

  return (
    <div className="fixed top-4 left-4 w-96 bg-black bg-opacity-80 text-white p-4 rounded-lg space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      {/* Status */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-green-400">Evolution Simulation</h2>
        <p className="text-sm text-gray-300">
          {isRunning ? "Running" : "Paused"} • Time: {formatTime(time)}
        </p>
      </div>

      {/* Generation Info */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-yellow-400">Generation {stats.generation}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div>Total Time: {formatTime(stats.totalTime * 1000)}</div>
        </CardContent>
      </Card>

      {/* Population Stats */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-400">Populations</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div className="flex justify-between">
            <span>Predators:</span>
            <span className="text-red-400 font-bold">{stats.populations.predators}</span>
          </div>
          <div className="flex justify-between">
            <span>Prey:</span>
            <span className="text-blue-400 font-bold">{stats.populations.prey}</span>
          </div>
          <div className="flex justify-between">
            <span>Food:</span>
            <span className="text-green-400 font-bold">{stats.populations.food}</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Traits - Predators */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-400">Predator Traits (Avg)</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div className="flex justify-between">
            <span>Speed:</span>
            <span>{stats.averageTraits.predator.speed.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{stats.averageTraits.predator.size.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Energy:</span>
            <span>{stats.averageTraits.predator.energy.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Aggression:</span>
            <span>{stats.averageTraits.predator.aggressiveness.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Traits - Prey */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-400">Prey Traits (Avg)</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-1">
          <div className="flex justify-between">
            <span>Speed:</span>
            <span>{stats.averageTraits.prey.speed.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{stats.averageTraits.prey.size.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Energy:</span>
            <span>{stats.averageTraits.prey.energy.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span>Fear:</span>
            <span>{stats.averageTraits.prey.fearLevel.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Simple Chart */}
      {chartData && chartData.length > 1 && (
        <Card className="bg-gray-800 border-gray-600">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-400">Population Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32 bg-gray-900 rounded p-2 relative overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 300 100">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="30" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Population lines */}
                {(() => {
                  const maxPop = Math.max(
                    ...chartData.map(d => Math.max(d.predatorCount, d.preyCount))
                  ) || 1;
                  
                  const predatorPoints = chartData.map((d, i) => 
                    `${(i / (chartData.length - 1)) * 300},${100 - (d.predatorCount / maxPop) * 80}`
                  ).join(' ');
                  
                  const preyPoints = chartData.map((d, i) => 
                    `${(i / (chartData.length - 1)) * 300},${100 - (d.preyCount / maxPop) * 80}`
                  ).join(' ');
                  
                  return (
                    <>
                      <polyline
                        points={predatorPoints}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                      <polyline
                        points={preyPoints}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                    </>
                  );
                })()}
              </svg>
              
              {/* Legend */}
              <div className="absolute top-1 right-1 text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-red-500"></div>
                  <span>Predators</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-0.5 bg-blue-500"></div>
                  <span>Prey</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
