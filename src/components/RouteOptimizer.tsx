
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { createNode, findPath } from '@/utils/astar';

const GRID_SIZE = 20;

type Point = {
  x: number;
  y: number;
} | null;

const RouteOptimizer = () => {
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill(null).map((_, y) => 
      Array(GRID_SIZE).fill(null).map((_, x) => createNode(x, y))
    )
  );
  const [startPoint, setStartPoint] = useState<Point>(null);
  const [endPoint, setEndPoint] = useState<Point>(null);
  const [path, setPath] = useState<any[]>([]);
  const [mode, setMode] = useState<'start' | 'end' | 'wall'>('start');

  const handleCellClick = (x: number, y: number) => {
    if (mode === 'start') {
      setStartPoint({ x, y });
      setMode('end');
    } else if (mode === 'end') {
      setEndPoint({ x, y });
      setMode('wall');
    } else {
      const newGrid = [...grid];
      newGrid[y][x].isWall = !newGrid[y][x].isWall;
      setGrid(newGrid);
    }
  };

  const calculatePath = () => {
    if (!startPoint || !endPoint) return;
    const newPath = findPath(startPoint, endPoint, grid);
    setPath(newPath);
  };

  const resetGrid = () => {
    setGrid(Array(GRID_SIZE).fill(null).map((_, y) => 
      Array(GRID_SIZE).fill(null).map((_, x) => createNode(x, y))
    ));
    setStartPoint(null);
    setEndPoint(null);
    setPath([]);
    setMode('start');
  };

  const getCellColor = (x: number, y: number) => {
    if (startPoint?.x === x && startPoint?.y === y) return 'bg-green-500';
    if (endPoint?.x === x && endPoint?.y === y) return 'bg-red-500';
    if (grid[y][x].isWall) return 'bg-gray-700';
    if (path.some(node => node.x === x && node.y === y)) return 'bg-blue-500';
    return 'bg-gray-100';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Route Optimizer</h1>
          
          <div className="mb-4 space-x-4">
            <Button 
              onClick={calculatePath}
              disabled={!startPoint || !endPoint}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Find Path
            </Button>
            <Button 
              onClick={resetGrid}
              variant="outline"
            >
              Reset Grid
            </Button>
            <span className="text-sm text-gray-600 ml-4">
              Mode: {mode === 'start' ? 'Place Start' : mode === 'end' ? 'Place End' : 'Place Walls'}
            </span>
          </div>

          <div className="grid gap-1" style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` 
          }}>
            {grid.map((row, y) => 
              row.map((_, x) => (
                <div
                  key={`${x}-${y}`}
                  onClick={() => handleCellClick(x, y)}
                  className={`
                    w-full aspect-square rounded-sm cursor-pointer
                    transition-colors duration-200 border border-gray-200
                    hover:opacity-80 ${getCellColor(x, y)}
                  `}
                />
              ))
            )}
          </div>

          {path.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Path length: {path.length - 1} steps
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteOptimizer;
