export type BetterBoardSection =
  | 'start'
  | 'board-setup'
  | 'shape-the-board'
  | 'work-faster'
  | 'how-to';

export interface BetterBoardDoc {
  sourceSlug: string;
  destinationSlug: string;
  section: BetterBoardSection;
  title: string;
  order: number;
}

export declare const betterBoardDocs: readonly BetterBoardDoc[];

export interface BetterBoardHowToDoc {
  destinationSlug: string;
  title: string;
  order: number;
}

export declare const betterBoardHowToDocs: readonly BetterBoardHowToDoc[];

export declare function assertUniqueDocMappings(
  docs: readonly BetterBoardDoc[]
): void;
