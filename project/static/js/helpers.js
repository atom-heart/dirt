export function timeToStr(timeObj) {
  return new Date(0, 0, 0, 0,
    timeObj.minutes,
    timeObj.seconds,
    timeObj.milliseconds
  ).toJSON()
}

export function strToTime(timeStr) {
  return {
    minutes: parseInt(timeStr.slice(0, 2), 10),
    seconds: parseInt(timeStr.slice(3, 5), 10),
    milliseconds: parseInt(timeStr.slice(6), 10)
  }
}
