const idleState = {
  isLoading: false,
  hasLoaded: false,
  error: false
}

export const compStates = {
  idle: idleState,
  isLoading: { ...idleState, isLoading: true },
  hasLoaded: { ...idleState, hasLoaded: true },
  error: { ...idleState, error: true }
}

export function setCompState(state, compKey, compState) {
  const updatedComp = { ...state[compKey], ...compState }
  return { ...state, [compKey]: updatedComp }
}
