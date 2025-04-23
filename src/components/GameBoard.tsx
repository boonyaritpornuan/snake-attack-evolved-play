
import React, { useEffect, useRef } from 'react';
import { GameState, Position } from '@/types/game';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  gameState: GameState;
  cellSize: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState, cellSize }) => {
  const { snake, food, gridSize, gameOver } = gameState;
  const { isMobile, isTablet } = useDeviceDetection();
  const boardRef = useRef<HTMLDivElement>(null);

  // Calculate responsive styling
  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridSize.width}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${gridSize.height}, ${cellSize}px)`,
    gap: '1px',
    margin: '0 auto',
    backgroundColor: 'rgba(42, 43, 56, 0.7)',
    border: '2px solid hsl(var(--primary))',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
    overflow: 'hidden',
  };

  // Apply shake effect when game over
  useEffect(() => {
    if (gameOver && boardRef.current) {
      boardRef.current.classList.add('shake');
      const timer = setTimeout(() => {
        if (boardRef.current) {
          boardRef.current.classList.remove('shake');
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gameOver]);

  // Helper to render snake cell
  const renderSnakeCell = (position: Position, index: number) => {
    const isHead = index === 0;
    const key = `snake-${position.x}-${position.y}`;
    
    return (
      <div
        key={key}
        className={cn(
          "rounded-sm",
          isHead 
            ? "bg-primary" 
            : "bg-primary/80",
          {
            "border border-white/20": isHead,
          }
        )}
        style={{
          gridColumn: position.x + 1,
          gridRow: position.y + 1,
          borderRadius: isHead ? '4px' : '3px',
        }}
      />
    );
  };

  // Render food with pulsing animation
  const renderFood = () => (
    <div
      key={`food-${food.x}-${food.y}`}
      className="food-item bg-accent rounded-full"
      style={{
        gridColumn: food.x + 1,
        gridRow: food.y + 1,
      }}
    />
  );

  return (
    <div 
      ref={boardRef}
      style={boardStyle}
      className={cn("transition-all", {
        "mt-4 mb-16": isMobile || isTablet,
        "mt-8 mb-8": !isMobile && !isTablet,
      })}
    >
      {snake.body.map(renderSnakeCell)}
      {renderFood()}
    </div>
  );
};

export default GameBoard;
