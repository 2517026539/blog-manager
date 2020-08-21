import Cookies from 'js-cookie'

export function saveArticle(data) {
  Cookies.set('article', data, {
    expires: 7
  })
}

export function getArticle() {
  return Cookies.get('article')
}

export function removeArticle() {
  JSON.remove('article')
}
