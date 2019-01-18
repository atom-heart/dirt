export const LOAD_ALL_EVENTS = 'allEvents:load'

export const loadAllEvents = (events) => ({
  type: LOAD_ALL_EVENTS,
  events
})
