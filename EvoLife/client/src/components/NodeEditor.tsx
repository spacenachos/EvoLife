import { useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Zap, Users, Apple } from "lucide-react";
import { useSimulation } from "../lib/stores/useSimulation";

interface NodeParam {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  description: string;
}

interface NodeConfig {
  id: string;
  title: string;
  type: 'behavior' | 'environment' | 'population';
  icon: any;
  color: string;
  params: Record<string, NodeParam>;
}

export default function NodeEditor() {
  const [isOpen, setIsOpen] = useState(false);
  const { config, genetics, ai, updateConfig, updateAIParams } = useSimulation();
  
  // Node configurations for visual programming
  const nodeConfigs = useMemo(() => [
    {
      id: 'predator-behavior',
      title: 'Predator AI',
      type: 'behavior',
      icon: Zap,
      color: 'bg-red-500',
      params: {
        huntRange: {
          value: 15,
          min: 5,
          max: 30,
          step: 1,
          label: 'Hunt Range',
          description: 'How far predators can detect prey'
        },
        aggressionMultiplier: {
          value: 0.1,
          min: 0.01,
          max: 0.5,
          step: 0.01,
          label: 'Aggression Factor',
          description: 'How likely predators are to hunt when not hungry'
        },
        energyGainFromPrey: {
          value: 0.7,
          min: 0.3,
          max: 1.0,
          step: 0.1,
          label: 'Energy from Prey',
          description: 'How much energy predators gain from killing prey'
        }
      }
    },
    {
      id: 'prey-behavior',
      title: 'Prey AI',
      type: 'behavior',
      icon: Users,
      color: 'bg-blue-500',
      params: {
        fleeRange: {
          value: 10,
          min: 3,
          max: 20,
          step: 1,
          label: 'Flee Range',
          description: 'How far prey can detect predators'
        },
        fleeSpeedMultiplier: {
          value: 1.2,
          min: 1.0,
          max: 2.0,
          step: 0.1,
          label: 'Flee Speed',
          description: 'Speed multiplier when fleeing'
        },
        fearSensitivity: {
          value: 1.0,
          min: 0.1,
          max: 2.0,
          step: 0.1,
          label: 'Fear Sensitivity',
          description: 'How easily prey gets scared'
        }
      }
    },
    {
      id: 'environment',
      title: 'Environment',
      type: 'environment',
      icon: Apple,
      color: 'bg-green-500',
      params: {
        foodSpawnRate: {
          value: config.foodSpawnRate * 3,
          min: 0.1,
          max: 5.0,
          step: 0.1,
          label: 'Food Spawn Rate',
          description: 'How often new food appears'
        },
        foodEnergyValue: {
          value: 30,
          min: 10,
          max: 100,
          step: 5,
          label: 'Food Energy',
          description: 'Energy value of each food item'
        },
        energyDecayRate: {
          value: 0.5,
          min: 0.1,
          max: 2.0,
          step: 0.1,
          label: 'Energy Decay',
          description: 'How fast creatures lose energy'
        }
      }
    },
    {
      id: 'population',
      title: 'Population',
      type: 'population',
      icon: Settings,
      color: 'bg-purple-500',
      params: {
        maxPredators: {
          value: config.maxPredators,
          min: 1,
          max: 50,
          step: 1,
          label: 'Max Predators',
          description: 'Maximum number of predators'
        },
        maxPrey: {
          value: config.maxPrey,
          min: 1,
          max: 100,
          step: 1,
          label: 'Max Prey',
          description: 'Maximum number of prey'
        },
        mutationRate: {
          value: config.mutationRate * 100,
          min: 1,
          max: 50,
          step: 1,
          label: 'Mutation Rate %',
          description: 'Chance of genetic mutations'
        }
      }
    }
  ] as NodeConfig[], [config]);

  const [nodeParams, setNodeParams] = useState<Record<string, Record<string, number>>>({
    'predator-behavior': {
      huntRange: 15,
      aggressionMultiplier: 0.1,
      energyGainFromPrey: 0.7
    },
    'prey-behavior': {
      fleeRange: 10,
      fleeSpeedMultiplier: 1.2,
      fearSensitivity: 1.0
    },
    'environment': {
      foodSpawnRate: 1.5,
      foodEnergyValue: 30,
      energyDecayRate: 0.5
    },
    'population': {
      maxPredators: 15,
      maxPrey: 30,
      mutationRate: 15
    }
  });

  const updateParam = useCallback((nodeId: string, paramKey: string, value: number) => {
    setNodeParams(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        [paramKey]: value
      }
    }));
  }, []);

  const applyChanges = useCallback(() => {
    // Apply environment changes
    const envParams = nodeParams['environment'];
    if (envParams) {
      updateConfig({
        foodSpawnRate: envParams.foodSpawnRate / 3, // Convert back from display value
        maxFood: config.maxFood, // Keep existing
        energyDecayRate: envParams.energyDecayRate,
      });
    }

    // Apply population changes
    const popParams = nodeParams['population'];
    if (popParams) {
      updateConfig({
        maxPredators: popParams.maxPredators,
        maxPrey: popParams.maxPrey,
        mutationRate: popParams.mutationRate / 100, // Convert from percentage
      });
    }

    // Apply AI behavior changes
    const predatorParams = nodeParams['predator-behavior'];
    const preyParams = nodeParams['prey-behavior'];
    
    const aiParams = {
      ...predatorParams,
      ...preyParams,
    };
    
    updateAIParams(aiParams);
    
    setIsOpen(false);
  }, [nodeParams, updateConfig, updateAIParams, config.maxFood]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 bg-black bg-opacity-80 hover:bg-opacity-90 text-white"
        size="sm"
      >
        <Settings size={16} className="mr-2" />
        Node Editor
      </Button>
    );
  }

  return (
    <div className="fixed inset-4 bg-black bg-opacity-95 text-white rounded-lg z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-600 flex items-center justify-between">
          <h2 className="text-xl font-bold text-green-400">Visual Node Programming</h2>
          <div className="flex gap-2">
            <Button onClick={applyChanges} size="sm" className="bg-green-600 hover:bg-green-700">
              Apply Changes
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="behavior" className="h-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="behavior">AI Behavior</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="population">Population</TabsTrigger>
            </TabsList>

            <TabsContent value="behavior" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nodeConfigs
                  .filter(node => node.type === 'behavior')
                  .map(node => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      params={nodeParams[node.id] || {}}
                      onUpdateParam={(param, value) => updateParam(node.id, param, value)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="environment" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nodeConfigs
                  .filter(node => node.type === 'environment')
                  .map(node => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      params={nodeParams[node.id] || {}}
                      onUpdateParam={(param, value) => updateParam(node.id, param, value)}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="population" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nodeConfigs
                  .filter(node => node.type === 'population')
                  .map(node => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      params={nodeParams[node.id] || {}}
                      onUpdateParam={(param, value) => updateParam(node.id, param, value)}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Connection Visual (simplified) */}
        <div className="p-4 border-t border-gray-600">
          <div className="text-sm text-gray-400 text-center">
            Node connections: Behavior Nodes → Environment → Population Dynamics
          </div>
          <div className="flex justify-center items-center mt-2 space-x-4">
            <Badge className="bg-red-500">Predator AI</Badge>
            <span>→</span>
            <Badge className="bg-blue-500">Prey AI</Badge>
            <span>→</span>
            <Badge className="bg-green-500">Environment</Badge>
            <span>→</span>
            <Badge className="bg-purple-500">Population</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NodeCardProps {
  node: NodeConfig;
  params: Record<string, number>;
  onUpdateParam: (param: string, value: number) => void;
}

function NodeCard({ node, params, onUpdateParam }: NodeCardProps) {
  const Icon = node.icon;

  return (
    <Card className="bg-gray-800 border-gray-600">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <div className={`w-3 h-3 rounded-full ${node.color}`} />
          <Icon size={16} />
          {node.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(node.params).map(([key, param]) => {
          const currentValue = params[key] ?? param.value;
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">{param.label}</label>
                <span className="text-sm text-gray-400">{currentValue.toFixed(2)}</span>
              </div>
              <Slider
                value={[currentValue]}
                onValueChange={(values) => onUpdateParam(key, values[0])}
                min={param.min}
                max={param.max}
                step={param.step}
                className="w-full"
              />
              <p className="text-xs text-gray-500">{param.description}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}