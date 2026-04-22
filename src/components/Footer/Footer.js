import { navigateTo } from '../../router.js'
import footerTemplate from './Footer.html?raw'
import './Footer.css'

export function Footer() {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = footerTemplate
  const element = wrapper.firstElementChild
  setFooterYear(element)

  wrapper.querySelectorAll('.footer-a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      navigateTo(link.getAttribute('href'))
    })
  })

  return element
}

function setActiveLink(links, currentPath) {
  links.forEach(link => {
    link.classList.remove('active')
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active')
    }
  })
}

export function FooterLinkBgChange() {
  const current = window.location.pathname
  const footerLinks = document.querySelectorAll('.footer-a')
  setActiveLink(footerLinks, current)
}

function getCurrentYear() {
  return new Date().getFullYear()
}

function setFooterYear(element) {
  const yearSpan = element.querySelector('.footer-year')
  if (yearSpan) {
    yearSpan.textContent = getCurrentYear()
  }
}