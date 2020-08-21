function debounce(fun, time, immediately) {
  let setTime = null
  const that = this
  const args = arguments
  function contents() {
    let result = ''
    if (setTime) {
      clearTimeout(setTime)
    }
    if (immediately && !setTime) {
      result = fun.apply(that, args)
    }
    setTime = setTimeout(() => {
      result = fun.apply(that, args)
    }, time)
    return result
  }
  contents.cancel = function() {
    clearTimeout(setTime)
  }
  return contents
}

export default debounce
