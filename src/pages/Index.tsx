
import React, { useState } from 'react';
import Game from '@/components/Game';
import InstructionPanel from '@/components/InstructionPanel';
import { Button } from '@/components/ui/button';
import { useDeviceDetection } from '@/hooks/use-device-detection';

const Index = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const { isMobile, isTablet } = useDeviceDetection();
  
  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4">
      {/* Header */}
      <header className="w-full max-w-3xl mx-auto text-center mb-6">
        <h1 className="text-4xl font-bold text-primary mb-2">Snake Attack</h1>
        <p className="text-muted-foreground">
          The classic game reimagined for {isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}
        </p>
      </header>
      
      {/* Game container */}
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Instructions toggle */}
        <div className="self-end mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-xs sm:text-sm"
          >
            {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
          </Button>
        </div>
        
        {/* Instructions panel */}
        {showInstructions && <InstructionPanel />}
        
        {/* Main game */}
        <Game />
      </main>
      
      {/* Footer */}
      <footer className="w-full max-w-3xl mx-auto mt-auto pt-8 text-center text-sm text-muted-foreground">
        <p>© 2025 Snake Attack - A responsive cross-platform game</p>
      </footer>
    </div>
  );
};

export default Index;
