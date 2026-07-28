export type BetterBoardSection =
  | 'start'
  | 'board-setup'
  | 'shape-the-board'
  | 'work-faster';

export interface BetterBoardDoc {
  sourceSlug: string;
  destinationSlug: string;
  section: BetterBoardSection;
  title: string;
  order: number;
}

export declare const betterBoardDocs: readonly BetterBoardDoc[];

export declare function assertUniqueDocMappings(
  docs: readonly BetterBoardDoc[]
): void;
