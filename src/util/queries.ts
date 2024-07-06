

export const zoneQuery = {
    displayId: true,
    id: true,
    name: true,
    parentId: true
}

export const playerQuery = {
    name: true,
    id: true,
    zone: {
        select: zoneQuery
    }
}

export const mapQuery = {
    id: true,
    uid: true,
    seasonUid: true,
    thumbnail: true,
    name: true,
    authorTime: true,
    goldTime: true,
    silverTime: true,
    bronzeTime: true,
    year: true,
    month: true,
    day: true,
    author: {
        select: playerQuery,
    }
}

export const statisticsQuery = {
    amount: true,
    points: true,
    first: true,
    second: true,
    third: true,
    top8: true,
    top16: true,
    top32: true,
    top64: true,
    top128: true,
    bestResult: true,
    average: true,
    position: true,
}

export const leaderboardQuery = {
    ...statisticsQuery,
    player: {
        select: playerQuery
    }
}
