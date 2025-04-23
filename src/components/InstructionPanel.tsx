
import React from 'react';
import { useDeviceDetection } from '@/hooks/use-device-detection';

const InstructionPanel: React.FC = () => {
  const { isMobile, isTablet } = useDeviceDetection();
  const isTouchDevice = isMobile || isTablet;

  return (
    <div className="w-full max-w-md mx-auto bg-secondary/50 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold text-primary mb-3">How to Play</h2>
      
      {isTouchDevice ? (
        <div className="space-y-2">
          <p className="text-sm text-foreground/90">• Use the D-pad buttons to change direction</p>
          <p className="text-sm text-foreground/90">• Collect food to grow longer</p>
          <p className="text-sm text-foreground/90">• Avoid hitting yourself</p>
          <p className="text-sm text-foreground/90">• Tap Pause/Resume to control the game</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-foreground/90">• Use Arrow Keys or WASD to change direction</p>
          <p className="text-sm text-foreground/90">• Press P to pause/resume the game</p>
          <p className="text-sm text-foreground/90">• Press R to restart</p>
          <p className="text-sm text-foreground/90">• Collect food to grow longer and avoid hitting yourself</p>
        </div>
      )}
    </div>
  );
};

export default InstructionPanel;
