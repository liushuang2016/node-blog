document.addEventListener('DOMContentLoaded', function () {
  var postDir = document.querySelector('#post-dir')
  var width = document.body.clientWidth

  if (!postDir || width < 992) {
    return
  }
  document.addEventListener('scroll', function (e) {
    var t = document.documentElement.scrollTop
    if (t > 380) {
      postDir.style.position = 'fixed'
      postDir.style.top = '20px'
    } else {
      postDir.style.position = 'relative'
    }
  })
})
