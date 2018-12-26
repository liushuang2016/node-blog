$(function () {
  var postDir = $('#post-dir')
  var width = $(document).outerWidth(true)
  if (!postDir || width < 992) {
    return
  }

  $(document).on('scroll', function (e) {
    var t = $(document).scrollTop()

    if (t > 380) {
      postDir.css('position', 'fixed')
      postDir.css('top', '20px')
      postDir.css('maxWidth', '250px')
    } else {
      postDir.css('position', 'relative')
    }
  })
})
