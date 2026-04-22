import { registerRoute, navigateTo } from './router.js'
import { MainLayout } from './layout/MainLayout/MainLayout.js'
import { HomePage } from './pages/home/home.js'
import { SearchPage } from './pages/search/search.js'
import { PlatformsPage } from './pages/platforms/platforms.js'
import { GenresPage } from './pages/genres/genres.js'
import { FavoritesPage } from './pages/favorites/favorites.js'
import { HistoryPage } from './pages/history/history.js'
import { ContactPage } from './pages/contact/contact.js'
import { DetailPage } from './pages/detail/detail.js'
import { NavbarLinkChange } from './components/Navbar/Navbar.js'
import { FooterLinkBgChange } from './components/Footer/Footer.js'
import './styles/tokens.css'
import './styles/global.css'

let layoutMounted = false

async function render(pageFactory) {
  const app = document.getElementById('app')

  if (!layoutMounted) {
    app.innerHTML = ''
    app.appendChild(MainLayout())
    layoutMounted = true
  }

  const content = app.querySelector('#content-slot')
  content.innerHTML = ''
  const pageContent = await pageFactory()
  content.appendChild(pageContent)

  NavbarLinkChange()
  FooterLinkBgChange()
}

registerRoute('/', () => render(HomePage))
registerRoute('/home', () => render(HomePage))
registerRoute('/search', () => render(SearchPage))
registerRoute('/favorites', () => render(FavoritesPage))
registerRoute('/history', () => render(HistoryPage))
registerRoute('/platforms', () => render(PlatformsPage))
registerRoute('/genres', () => render(GenresPage))
registerRoute('/contact', () => render(ContactPage))
registerRoute('/detail', () => {
  const params = new URLSearchParams(location.search)
  const id = params.get('id')
  render(() => DetailPage(id))
})
registerRoute('*', () => render(HomePage))

document.addEventListener('DOMContentLoaded', () => navigateTo(location.pathname))

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW error:', err))
  })
}