const idleState = { isLoading: false, hasLoaded: false, error: false }

export const compStates = {
  idle: idleState,
  isLoading: Object.assign({}, idleState, { isLoading: true }),
  hasLoaded: Object.assign({}, idleState, { hasLoaded: true }),
  error: Object.assign({}, idleState, { error: true })
}
