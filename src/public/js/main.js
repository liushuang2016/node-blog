$(function () {
  var postDir = $('#post-dir')
  var width = $(document).outerWidth(true)

  if (!postDir || width < 992) {
    return
  }

  setPosition(postDir)

  $(document).on('scroll', function (e) {
    setPosition(postDir)
  })
})

function setPosition($ele) {
  var t = $(document).scrollTop()
  if (t > 380) {
    toFixed($ele)
  } else {
    toRelative($ele)
  }
}

function toFixed($ele) {
  $ele.css('position', 'fixed')
  $ele.css('top', '20px')
  $ele.css('maxWidth', '250px')
}

function toRelative($ele) {
  $ele.css('position', 'relative')
}
