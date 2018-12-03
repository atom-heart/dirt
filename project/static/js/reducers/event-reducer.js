import {
  MOUNT_EVENT_DATA,
  IS_LOADING_EVENT,
  MOUNT_STAGE_DATA,
  THROW_STAGE_ERROR,
  IS_LOADING_STAGE,
  THROW_EVENT_ERROR,
  UPDATE_SPLIT,
  TURN_UPDATE,
  FINISH_SPLIT_REQUEST,
  UPDATE_SPLITS,
  UPDATE_STAGE,
  UPDATE_EVENT,
  FINISH_SPLIT_ERROR
} from '../actions/event-actions.js'

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
  let newState, theEvent, allStages, currentStage, allSplits, currentSplit, toUpdate

  switch (action.type) {

  case IS_LOADING_EVENT:
    return Object.assign({}, state, {isLoading: true, loaded: false, error: false})

  case MOUNT_EVENT_DATA:
    const stages = action.payload.stages.map(stage => Object.assign({}, stageBlueprint, stage))
    return Object.assign({}, state, action.payload, {stages, isLoading: false, loaded: true, error: false})

  case THROW_EVENT_ERROR:
    return Object.assign({}, state, {isLoading: false, error: true})

  case IS_LOADING_STAGE:
    allStages = JSON.parse(JSON.stringify(state.stages))

    currentStage = allStages.find(stage => stage.id == action.stageId)
    currentStage = Object.assign(currentStage, {isLoading: true, error: false})

    return Object.assign({}, state, {stages: allStages})

  case MOUNT_STAGE_DATA:
    allStages = JSON.parse(JSON.stringify(state.stages))

    currentStage = allStages.find(stage => stage.id == action.stageId)
    currentStage = Object.assign(currentStage, {
      ranking: action.payload.ranking,
      progress: action.payload.progress,
      isLoading: false,
      loaded: true
    })

    let allSplits = JSON.parse(JSON.stringify(state.splits))

    for (let split of action.payload.splits) {
      split['stage_id'] = action.stageId
      allSplits.push(Object.assign(split, {
        finishRequestLoading: false,
        finishRequestError: false
      }))
    }

    return Object.assign({}, state, {stages: allStages, splits: allSplits})

  case THROW_STAGE_ERROR:
    allStages = JSON.parse(JSON.stringify(state.stages))

    currentStage = allStages.find(stage => stage.id == action.stageId)
    currentStage = Object.assign(currentStage, {isLoading: false, error: true})

    return Object.assign({}, state, {stages: allStages})

  case UPDATE_SPLIT:
    allSplits = JSON.parse(JSON.stringify(state.splits))

    currentSplit = allSplits.find(split => split.id == action.split.id)
    currentSplit = Object.assign(currentSplit, action.split)

    return Object.assign({}, state, {splits: allSplits})

  case TURN_UPDATE:
    allSplits = JSON.parse(JSON.stringify(state.splits))

    currentSplit = allSplits.find(split => split.id == action.payload.id)
    currentSplit = Object.assign(currentSplit, action.payload)

    return Object.assign({}, state, theEvent, {splits: allSplits})

  case UPDATE_SPLITS:
    allSplits = JSON.parse(JSON.stringify(state.splits))

    action.splits.forEach(updatedSplit => {
      currentSplit = allSplits.find(split => split.id == updatedSplit.id)
      currentSplit = currentSplit ? Object.assign(currentSplit, updatedSplit) : null
    })

    return Object.assign({}, state, { splits: allSplits })

  case UPDATE_STAGE:
    allStages = JSON.parse(JSON.stringify(state.stages))
    currentStage = allStages.find(stage => stage.id == action.stage.id)

    currentStage = Object.assign(currentStage, action.stage)

    return Object.assign({}, state, { stages: allStages })

  case UPDATE_EVENT:
    return Object.assign({}, state, action.payload)

  case FINISH_SPLIT_REQUEST:
    allSplits = JSON.parse(JSON.stringify(state.splits))
    currentSplit = allSplits.find(split => split.id == action.splitId)

    currentSplit = Object.assign(currentSplit, {
      finishRequestLoading: true,
      finishRequestError: false
    })

    return Object.assign({}, state, {splits: allSplits})

  case FINISH_SPLIT_ERROR:
    allSplits = JSON.parse(JSON.stringify(state.splits))
    currentSplit = allSplits.find(split => split.id == action.splitId)

    currentSplit = Object.assign(currentSplit, {
      finishRequestLoading: false,
      finishRequestError: true
    })

    return Object.assign({}, state, {splits: allSplits})

  default:
    return state

  }
}
