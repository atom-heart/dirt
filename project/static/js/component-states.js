const idleState = { isLoading: false, hasLoaded: false, error: false }

export const compStates = {
  idle: idleState,
  isLoading: Object.assign({}, idleState, { isLoading: true }),
  hasLoaded: Object.assign({}, idleState, { hasLoaded: true }),
  error: Object.assign({}, idleState, { error: true })
}

export function idlize(entities, compState) {
  return entities.map(entity => Object.assign(entity, compState))
}

export function setCompState(state, compKey, compState) {
  const comp = Object.assign(state[compKey], compState)
  return Object.assign({}, state, { [compKey]: comp })
}
