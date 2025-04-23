
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, GameState, Position } from '@/types/game';
import GameBoard from './GameBoard';
import GameControls from './GameControls';
import GameOverModal from './GameOverModal';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { toast } from '@/hooks/use-toast';

// Initial snake position and direction
const initialSnake = {
  body: [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ],
  direction: 'RIGHT' as Direction,
  nextDirection: 'RIGHT' as Direction,
};

// Generate random position for food
const generateFood = (gridSize: { width: number; height: number }, snakeBody: Position[]): Position => {
  let newFood: Position;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize.width),
      y: Math.floor(Math.random() * gridSize.height),
    };
    // Make sure food doesn't overlap with snake
  } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  
  return newFood;
};

// Calculate appropriate grid and cell size based on screen dimensions
const calculateGridSize = (width: number, height: number) => {
  const isMobile = width < 768;
  const isLandscape = width > height;
  
  // Determine grid dimensions based on device
  let gridWidth, gridHeight, cellSize;
  
  if (isMobile) {
    if (isLandscape) {
      gridWidth = 20;
      gridHeight = 15;
    } else {
      gridWidth = 15;
      gridHeight = 20;
    }
    cellSize = Math.min(Math.floor(width / gridWidth) - 2, Math.floor(height / gridHeight) - 2, 20);
  } else {
    gridWidth = 20;
    gridHeight = 20;
    cellSize = Math.min(Math.floor(width / 40), Math.floor(height / 40), 25);
  }
  
  return { gridSize: { width: gridWidth, height: gridHeight }, cellSize };
};

const Game: React.FC = () => {
  const { width, height, isMobile, isTablet } = useDeviceDetection();
  const { gridSize, cellSize } = calculateGridSize(
    Math.min(width, 800),
    Math.min(height, 800)
  );
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    snake: JSON.parse(JSON.stringify(initialSnake)),
    food: generateFood(gridSize, initialSnake.body),
    gridSize,
    score: 0,
    gameOver: false,
    isPlaying: false,
    speed: isMobile ? 180 : 150, // Slightly slower on mobile for better playability
  });
  
  const gameLoopRef = useRef<number | null>(null);

  // Change snake direction
  const changeDirection = useCallback((newDirection: Direction) => {
    setGameState(prevState => {
      const { snake } = prevState;
      
      // Prevent 180-degree turns
      if (
        (newDirection === 'UP' && snake.direction === 'DOWN') ||
        (newDirection === 'DOWN' && snake.direction === 'UP') ||
        (newDirection === 'LEFT' && snake.direction === 'RIGHT') ||
        (newDirection === 'RIGHT' && snake.direction === 'LEFT')
      ) {
        return prevState;
      }
      
      return {
        ...prevState,
        snake: {
          ...snake,
          nextDirection: newDirection,
        },
      };
    });
  }, []);

  // Game loop
  const gameLoop = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || !prevState.isPlaying) {
        return prevState;
      }
      
      const { snake, food, gridSize, score } = prevState;
      const { body, nextDirection } = snake;
      
      // Create a copy of the current snake head
      const head = { ...body[0] };
      
      // Move the head based on direction
      switch (nextDirection) {
        case 'UP':
          head.y = (head.y - 1 + gridSize.height) % gridSize.height;
          break;
        case 'DOWN':
          head.y = (head.y + 1) % gridSize.height;
          break;
        case 'LEFT':
          head.x = (head.x - 1 + gridSize.width) % gridSize.width;
          break;
        case 'RIGHT':
          head.x = (head.x + 1) % gridSize.width;
          break;
      }
      
      // Check if snake collided with itself
      const selfCollision = body.slice(1).some(
        segment => segment.x === head.x && segment.y === head.y
      );
      
      if (selfCollision) {
        return {
          ...prevState,
          gameOver: true,
          isPlaying: false,
        };
      }
      
      // Create new snake body
      const newBody = [head, ...body.slice(0, -1)];
      
      // Check if snake ate food
      const ateFood = head.x === food.x && head.y === food.y;
      
      if (ateFood) {
        // Add segment to snake (put back the last piece that was removed)
        newBody.push(body[body.length - 1]);
        
        const newFood = generateFood(gridSize, newBody);
        const newScore = score + 1;
        
        // Speed up slightly as score increases
        const newSpeed = Math.max(80, prevState.speed - (newScore % 5 === 0 ? 5 : 0));
        
        return {
          ...prevState,
          snake: {
            ...snake,
            body: newBody,
            direction: nextDirection,
          },
          food: newFood,
          score: newScore,
          speed: newSpeed,
        };
      }
      
      // Normal movement
      return {
        ...prevState,
        snake: {
          ...snake,
          body: newBody,
          direction: nextDirection,
        },
      };
    });
  }, []);

  // Start game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      gameLoopRef.current = window.setInterval(gameLoop, gameState.speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.gameOver, gameState.speed, gameLoop]);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isPlaying: false,
    }));
    toast({
      title: "Game Paused",
      description: "Take a breather!",
      duration: 1500,
    });
  }, []);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameState(prevState => ({
      ...prevState,
      isPlaying: true,
    }));
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    setGameState({
      snake: JSON.parse(JSON.stringify(initialSnake)),
      food: generateFood(gridSize, initialSnake.body),
      gridSize,
      score: 0,
      gameOver: false,
      isPlaying: true,
      speed: isMobile ? 180 : 150,
    });
    toast({
      title: "Game Restarted",
      description: "Good luck!",
      duration: 1500,
    });
  }, [gridSize, isMobile]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Score display */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Score: <span className="text-accent">{gameState.score}</span>
        </h2>
        
        {!gameState.isPlaying && !gameState.gameOver && (
          <button
            onClick={resumeGame}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
          >
            Start Game
          </button>
        )}
      </div>
      
      {/* Game board */}
      <GameBoard gameState={gameState} cellSize={cellSize} />
      
      {/* Game controls */}
      <GameControls
        onDirectionChange={changeDirection}
        onPause={pauseGame}
        onResume={resumeGame}
        onRestart={restartGame}
        isPlaying={gameState.isPlaying}
        gameOver={gameState.gameOver}
      />
      
      {/* Game over modal */}
      <GameOverModal
        score={gameState.score}
        onRestart={restartGame}
        isOpen={gameState.gameOver}
      />
    </div>
  );
};

export default Game;
