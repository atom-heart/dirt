const initialState = {
  byId: {},
  allIds: {}
}

const stageBlueprint = {
  id: null,
  stageFinished: null,
  ranking: {},
  splitsLoaded: false,
}

export const stagesReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
}
