import * as marked from "marked";

export const format = (time: any, template = 'YY-MM-DD hh:mm'): string => {
  time = time ? time : Date.now()
  const date = new Date(time)
  const year = String(date.getFullYear())
  const month = String(date.getMonth() + 1)
  const day = String(date.getDate())
  const hour = String(date.getHours())
  const minutes = String(date.getMinutes())
  const seconds = String(date.getSeconds())

  const format = template.replace(
    /Y{2,4}|M{1,2}|D{1,2}|h{1,2}|m{1,2}|s{1,2}/g,
    (match) => {
      switch (match) {
        case 'YY':
          return year
        case 'MM':
          return month.length === 1 ? `0${month}` : month
        case 'DD':
          return day.length === 1 ? `0${day}` : day
        case 'hh':
          return hour.length === 1 ? `0${hour}` : hour
        case 'mm':
          return minutes.length === 1 ? `0${minutes}` : minutes
        case 'ss':
          return seconds.length === 1 ? `0${seconds}` : seconds
      }
    }
  )

  return format
}

export const toMarked = (content: string, ops = {}): string => {
  return marked(content, {
    headerIds: true,
    ...ops
  })
}

export const markedToDir = (content: string): string => {
  const arr = content.split('\r\n').filter(line => {
    return line[0] === '#'
  }).map(line => {
    const arr = line.split(/\s+/)
    const n = arr.shift().length
    const hash = arr.join(' ')
    return `<a href="#${hash}" class="dir-item dir-h${n}">${hash}</a>`
  })

  return arr.join(' ')
}
