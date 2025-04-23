import React, { useCallback, useEffect } from 'react';
import { Direction } from '@/types/game';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause } from 'lucide-react';

interface GameControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  isPlaying: boolean;
  gameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  onDirectionChange,
  onPause,
  onResume,
  onRestart,
  isPlaying,
  gameOver,
}) => {
  const { isMobile, isTablet } = useDeviceDetection();
  const isTouchDevice = isMobile || isTablet;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onDirectionChange('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onDirectionChange('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onDirectionChange('RIGHT');
          break;
        case 'p':
        case 'P':
          isPlaying ? onPause() : onResume();
          break;
        case 'r':
        case 'R':
          onRestart();
          break;
        default:
          break;
      }
    },
    [onDirectionChange, onPause, onResume, onRestart, isPlaying, gameOver]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleDirectionClick = (direction: Direction) => {
    if (gameOver) return;
    onDirectionChange(direction);
  };

  if (isTouchDevice) {
    return (
      <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-10">
        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full bg-secondary/80 backdrop-blur-sm border-primary"
            onClick={() => handleDirectionClick('UP')}
          >
            <ArrowUp className="h-8 w-8" />
          </Button>

          <div className="flex justify-center items-center gap-8 my-2">
            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full bg-secondary/80 backdrop-blur-sm border-primary"
              onClick={() => handleDirectionClick('LEFT')}
            >
              <ArrowLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full bg-secondary/80 backdrop-blur-sm border-primary"
              onClick={isPlaying ? onPause : onResume}
            >
              <Pause className="h-8 w-8" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full bg-secondary/80 backdrop-blur-sm border-primary"
              onClick={() => handleDirectionClick('RIGHT')}
            >
              <ArrowRight className="h-8 w-8" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="w-16 h-16 rounded-full bg-secondary/80 backdrop-blur-sm border-primary"
            onClick={() => handleDirectionClick('DOWN')}
          >
            <ArrowDown className="h-8 w-8" />
          </Button>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            className="px-4 py-2 bg-secondary/80 backdrop-blur-sm"
            onClick={onRestart}
          >
            Restart
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4 mt-4">
      <Button
        variant="outline"
        className="px-4 py-2"
        onClick={isPlaying ? onPause : onResume}
      >
        {isPlaying ? 'Pause (P)' : 'Resume (P)'}
      </Button>
      <Button
        variant="outline"
        className="px-4 py-2"
        onClick={onRestart}
      >
        Restart (R)
      </Button>
    </div>
  );
};

export default GameControls;
