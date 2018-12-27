$(function () {
  var postDir = $('#post-dir')
  var commentsContent = $('#comments-content')

  // 设置目录 scroll 事件监听
  setDirPosition(postDir)
  // 设置 回复 功能
  replay(commentsContent)
})

function replay($ele) {
  var width = $(document).outerWidth(true)
  // 在非移动平台显示评论
  if (!$ele || width < 768) {
    return
  }

  $ele.on('click', function (e) {
    var $t = $(e.target)
    if ($t.hasClass('comments-replay')) {
      var name = $t.attr('data-name')
      var $c = $('#comments')
      $c.val('回复 ' + name + ': ')
    }
  })
}

function setDirPosition($ele) {
  var width = $(document).outerWidth(true)
  // 只在桌面平台显示目录
  if (!$ele || width < 992) {
    return
  }

  setPosition($ele)

  $(document).on('scroll', function (e) {
    setPosition($ele)
  })
}

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
