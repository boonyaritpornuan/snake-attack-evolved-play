
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export interface Snake {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
}

export interface GameState {
  snake: Snake;
  food: Position;
  gridSize: {
    width: number;
    height: number;
  };
  score: number;
  gameOver: boolean;
  isPlaying: boolean;
  speed: number;
}

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
}
