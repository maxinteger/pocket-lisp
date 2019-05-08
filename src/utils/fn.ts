export const identity: <T>(x: T) => T = x => x

export const always: <T>(x: T) => () => T = x => () => x
