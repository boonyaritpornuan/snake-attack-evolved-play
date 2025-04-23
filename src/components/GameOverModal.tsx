
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface GameOverModalProps {
  score: number;
  onRestart: () => void;
  isOpen: boolean;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  onRestart,
  isOpen,
}) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-secondary border-primary">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">Game Over</DialogTitle>
          <DialogDescription className="text-center">
            <p className="text-xl mt-2">Your Score: <span className="font-bold text-accent">{score}</span></p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 text-center">
          <p className="text-muted-foreground">
            {score < 5 
              ? "Keep practicing! You'll get better." 
              : score < 10 
                ? "Good effort! Can you beat your score?" 
                : "Impressive! You're getting good at this."}
          </p>
        </div>
        <DialogFooter className="flex justify-center">
          <Button
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto px-8 bg-primary hover:bg-primary/80"
          >
            Play Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverModal;
