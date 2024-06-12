const MAX_POINTS_MAIN_CUP = 1000;
const MAX_POINTS_RERUN_CUP = 200;

const MIN_POINTS = 1;

const AWARDED_PLAYERS_MAIN_CUP = 640;
const AWARDED_PLAYERS_RERUN_CUP = 128;


export const getPointsForPosition = (position: number, rerun: boolean) => {


    const maxAwardedPlayers = rerun ? AWARDED_PLAYERS_RERUN_CUP : AWARDED_PLAYERS_MAIN_CUP;
    const maxPoints = rerun ? MAX_POINTS_RERUN_CUP : MAX_POINTS_MAIN_CUP;

    if (position < 0 || position > maxAwardedPlayers) {
        throw new Error(`Illegal Argument: position must be between 1 and ${maxAwardedPlayers} but was ${position}`);
    }

    return MIN_POINTS + (maxPoints - MIN_POINTS) * (1 - Math.log10(position) / Math.log10(maxAwardedPlayers))
}