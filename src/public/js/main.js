$(function () {
  var postDir = $('#post-dir')
  var commentsContent = $('#comments-content')
  var $search = $('#search')

  // 设置目录 scroll 事件监听
  setDirPosition(postDir)
  // 设置 回复 功能
  replay(commentsContent)
  // 搜索功能
  search($search)
  // highlight.js
  highlight(commentsContent)
})

function highlight($ele) {
  if (!$ele) {
    return
  }

  $('pre code').each(function (i, block) {
    hljs.highlightBlock(block);
  });
}

function search($ele) {
  if (!$ele) {
    return
  }

  var $s = $('#input-search')
  $ele.on('click', function (e) {
    if ($s.hasClass('hidden')) {
      $s.removeClass('hidden fadeOut').addClass('fadeIn')
    } else {
      $s.removeClass('fadeIn').addClass('fadeOut')
      setTimeout(function () {
        $s.addClass('hidden')
      }, 800)
    }
  })

  $s.on('keyup', function (e) {
    if (e.keyCode === 13) {
      var val = $s.find('input').val()
      if (val) {
        val = val.trim().replace(/\s+/, '+')
        window.open(`https://www.google.com/search?hl=zh-CN&q=site:liushuang.info+${val}`)
      }
    }
  })
}

function replay($ele) {
  var width = $(document).outerWidth(true)
  if (!$ele) {
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
