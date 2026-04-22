import searchTemplate        from './search.html?raw'
import './search.css'
import { createSearchBar }   from '../../components/SearchBar/SearchBar.js'
import { createFilterPanel } from '../../components/FilterPanel/FilterPanel.js'
import { createPagination }  from '../../components/Pagination/Pagination.js'
import { createGameCard }    from '../../components/GameCard/GameCard.js'
import { createSkeletonCard } from '../../components/SkeletonCard/SkeletonCard.js'
import { gameService }       from '../../services/gameService.js'

const PAGE_SIZE = 10

function readInitialStateFromUrl() {
  const params = new URLSearchParams(location.search)
  return {
    search:    params.get('search')    || '',
    genres:    params.get('genres')    || '',
    stores:    params.get('stores')    || '',
    platforms: params.get('platforms') || '',
    ordering:  params.get('ordering')  || '',
    page: 1,
  }
}

export async function SearchPage() {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = searchTemplate

  const state = readInitialStateFromUrl()

  const gameGrid   = wrapper.querySelector('#game-grid')
  const pagination = createPagination({ onPageChange: handlePageChange })

  wrapper.querySelector('#search-bar-mount').appendChild(
    createSearchBar({ onSearch: handleSearch })
  )

  const filterPanel = await createFilterPanel({ onFilterChange: handleFilterChange, initialValues: state })
  wrapper.querySelector('#filter-panel-mount').appendChild(filterPanel)
  wrapper.querySelector('#pagination-mount').appendChild(pagination.element)

  loadGames()

  return wrapper.firstElementChild

  function handleSearch(query) {
    state.search = query
    state.page = 1
    pagination.resetPage()
    loadGames()
  }

  function handleFilterChange(filters) {
    Object.assign(state, filters)
    state.page = 1
    pagination.resetPage()
    loadGames()
  }

  function handlePageChange(page) {
    state.page = page
    loadGames()
  }

  async function loadGames() {
    renderSkeletons(gameGrid, PAGE_SIZE)
    const data = await gameService.getAll(buildParams(state))
    renderGames(data.results, gameGrid)
    pagination.update({
      count: data.count,
      pageSize: PAGE_SIZE,
      next: data.next,
      previous: data.previous,
    })
  }
}

function buildParams({ search, genres, stores, platforms, ordering, page }) {
  const params = { page, page_size: PAGE_SIZE }
  if (search) params.search = search
  if (genres) params.genres = genres
  if (stores) params.stores = stores
  if (platforms) params.platforms = platforms
  if (ordering) params.ordering = ordering
  return params
}

function renderSkeletons(container, count) {
  container.innerHTML = ''
  Array.from({ length: count }).forEach(() =>
    container.appendChild(createSkeletonCard())
  )
}

function renderGames(games, container) {
  container.innerHTML = ''
  games.forEach(game => container.appendChild(createGameCard(game)))
}