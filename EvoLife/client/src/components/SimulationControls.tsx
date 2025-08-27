import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useSimulation } from "../lib/stores/useSimulation";

export default function SimulationControls() {
  const { isRunning, speed, start, pause, reset, setSpeed } = useSimulation();

  return (
    <div className="fixed bottom-4 left-4 right-4 flex justify-center">
      <Card className="bg-black bg-opacity-80 border-gray-600">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <Button
              onClick={isRunning ? pause : start}
              size="sm"
              className={`flex items-center gap-2 text-white border ${
                isRunning 
                  ? "bg-red-600 hover:bg-red-700 border-red-500" 
                  : "bg-green-600 hover:bg-green-700 border-green-500"
              }`}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              {isRunning ? "Pause" : "Start"}
            </Button>

            {/* Reset */}
            <Button
              onClick={reset}
              size="sm"
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white border border-gray-500"
            >
              <RotateCcw size={16} />
              Reset
            </Button>

            {/* Speed Control */}
            <div className="flex items-center gap-3 text-white">
              <span className="text-sm whitespace-nowrap">Speed:</span>
              <div className="w-32">
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={0.1}
                  max={5.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              <span className="text-sm min-w-[2rem] text-center">{speed.toFixed(1)}x</span>
            </div>

            {/* Camera Controls Help */}
            <div className="text-xs text-gray-300 border-l border-gray-600 pl-4">
              <div>Camera: WASD + QE + Mouse</div>
              <div>W/S: Forward/Back</div>
              <div>A/D: Left/Right</div>
              <div>Q/E: Up/Down</div>
              <div>Click: Mouse Look</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
