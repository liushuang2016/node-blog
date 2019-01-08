import * as marked from "marked";

export const format = (time: any, template = 'YY-MM-DD'): string => {
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
  const renderer = new marked.Renderer()
  marked.setOptions({
    headerIds: true,
    ...ops
  })
  renderer.link = function (href, title, text) {
    return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>';
  }
  renderer.heading = function (text, level, raw) {
    raw = raw.replace(/\s+/g, '-').replace('/^#+/', '')
    return `<h${level} id=${raw}>${text}</h${level}>`
  }
  return marked(content, { renderer })
}

export const markedToDir = (content: string): string => {
  const arr = content.split(/[\r\n]\n|\n/).filter(line => {
    return line[0] === '#'
  }).map(line => {
    const arr = line.split(/\s+/)
    const n = arr.shift().length
    const text = arr.join(' ')
    const raw = text.replace(/\s+/g, '-').replace('/^#+/', '')
    return `<li class="dir-item dir-h${n}"><a href="#${raw}">${text}</a></li>`
  })

  return arr.join(' ')
}
