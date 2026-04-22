import layoutTemplate from './MainLayout.html?raw'
import './MainLayout.css'
import { Navbar } from '../../components/Navbar/Navbar.js'
import { Footer } from '../../components/Footer/Footer.js'

export function MainLayout() {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = layoutTemplate
  const layout = wrapper.firstElementChild

  layout.querySelector('#navbar-slot').appendChild(Navbar())
  layout.querySelector('#footer-slot').appendChild(Footer())

  return layout
}