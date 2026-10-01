export type HeroState = 'idle' | 'hiding' | 'peeking' | 'returning';
export const isTransitioning = (state: HeroState) => state === 'hiding' || state === 'returning';
