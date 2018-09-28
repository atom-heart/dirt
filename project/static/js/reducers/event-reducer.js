import {
  MOUNT_EVENT_DATA,
  IS_LOADING_EVENT,
  MOUNT_STAGE_DATA,
  THROW_STAGE_ERROR,
  IS_LOADING_STAGE,
  THROW_EVENT_ERROR
} from '../actions/event-actions.js';

const eventBlueprint = {
  isLoading: true,
  loaded: false,
  error: false,
  stages: [],
  splits: []
}

const stageBlueprint = {
  isLoading: true,
  loaded: false,
  error: false,
  ranking: [],
  progress: []
}

export const eventReducer = (state = eventBlueprint, action) => {
  let allStages, currentStage;

  switch (action.type) {

    case IS_LOADING_EVENT:
      return Object.assign({}, state, {isLoading: true, loaded: false, error: false});

    case MOUNT_EVENT_DATA:
      const stages = action.payload.stages.map(stage => Object.assign({}, stageBlueprint, stage));
      return Object.assign({}, state, action.payload, {stages, isLoading: false, loaded: true, error: false});

    case THROW_EVENT_ERROR:
      return Object.assign({}, state, {isLoading: false, error: true});

    case IS_LOADING_STAGE:
      allStages = JSON.parse(JSON.stringify(state.stages));

      currentStage = allStages.find(stage => stage.id == action.stageId);
      currentStage = Object.assign(currentStage, {isLoading: true, error: false});

      return Object.assign({}, state, {stages: allStages});

    case MOUNT_STAGE_DATA:
      allStages = JSON.parse(JSON.stringify(state.stages));

      currentStage = allStages.find(stage => stage.id == action.stageId);
      currentStage = Object.assign(currentStage, {
        ranking: action.payload.ranking,
        progress: action.payload.progress,
        isLoading: false,
        loaded: true
      });

      let allSplits = JSON.parse(JSON.stringify(state.splits));

      for (let split of action.payload.splits) {
        split['stage_id'] = action.stageId;
        allSplits.push(split);
      }

      return Object.assign({}, state, {stages: allStages, splits: allSplits});

    case THROW_STAGE_ERROR:
      allStages = JSON.parse(JSON.stringify(state.stages));

      currentStage = allStages.find(stage => stage.id == action.stageId);
      currentStage = Object.assign(currentStage, {isLoading: false, error: true});

      return Object.assign({}, state, {stages: allStages});

    default:
      return state;

  };
}
