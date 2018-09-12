import {
  MOUNT_EVENT_DATA,
  IS_LOADING_EVENT,
  MOUNT_STAGE_DATA
} from '../actions/event-actions.js';

const eventBlueprint = {
  isLoading: true,
  error: false,
  stages: [],
}

const stageBlueprint = {
  isLoading: true,
  loaded: false,
  error: false,
  ranking: {}
};

export const eventReducer = (state = eventBlueprint, action) => {
  switch (action.type) {

    case IS_LOADING_EVENT:
      return Object.assign({}, state, {isLoading: true})

    case MOUNT_EVENT_DATA:
      const stages = action.payload.stages.map(stage => Object.assign({}, stageBlueprint, stage));
      return Object.assign({}, state, action.payload, {stages, isLoading: false});

    case MOUNT_STAGE_DATA:
      let allStages = JSON.parse(JSON.stringify(state.stages));
      let currentStage = allStages.find(stage => stage.id == action.stageId);
      currentStage = Object.assign(currentStage, {
        ranking: action.payload,
        isLoading: false,
        loaded: true
      });
      return Object.assign({}, state, {stages: allStages});

    default:
      return state;

  };
}
