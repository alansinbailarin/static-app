const moduleButtons = document.querySelectorAll('.module-action')
const progressFill = document.querySelector('#progress-fill')
const progressLabel = document.querySelector('#progress-label')
const progressPercent = document.querySelector('#progress-percent')
const progressMessage = document.querySelector('#progress-message')
const moduleDetails = {
  1: {
    title: 'Introducción a Azure',
    summary: 'Tu primer mapa de la plataforma de Microsoft para crear soluciones en la nube.',
    topics: 'Regiones y zonas, suscripciones, grupos de recursos y responsabilidad compartida.',
    practice: 'Identificarás qué necesitas para crear tu primer recurso sin perderte entre servicios.'
  },
  2: {
    title: 'Introducción a la nube',
    summary: 'Los conceptos que explican por qué una aplicación moderna vive en la nube.',
    topics: 'IaaS, PaaS y SaaS, elasticidad, alta disponibilidad y consumo bajo demanda.',
    practice: 'Compararás modelos de servicio y elegirás el más adecuado para un caso real.'
  },
  3: {
    title: 'Herramientas esenciales',
    summary: 'El conjunto de herramientas para administrar Azure desde el navegador o la terminal.',
    topics: 'Azure Portal, Cloud Shell, Azure CLI, PowerShell y Visual Studio Code.',
    practice: 'Crearás y consultarás recursos con dos formas distintas de trabajar.'
  },
  4: {
    title: 'Componentes esenciales',
    summary: 'Cómo se conectan las piezas que hacen confiable y observable una solución.',
    topics: 'Redes, almacenamiento, identidad, cómputo, bases de datos y Azure Monitor.',
    practice: 'Dibujarás una arquitectura sencilla y reconocerás la función de cada componente.'
  },
  5: {
    title: 'Aplicaciones y páginas web',
    summary: 'El paso de una aplicación local a una experiencia web disponible en Internet.',
    topics: 'App Service, despliegues, variables de entorno, dominios y escalado básico.',
    practice: 'Publicarás una aplicación web y dejarás lista una URL para compartirla.'
  }
}

const savedModules = JSON.parse(localStorage.getItem('azure-course-progress') || '[]')

function updateProgress() {
  const completedCount = document.querySelectorAll('.module-action.is-done').length
  const percentage = Math.round((completedCount / moduleButtons.length) * 100)
  progressFill.style.width = `${percentage}%`
  progressLabel.textContent = `${completedCount} / ${moduleButtons.length} completados`
  progressPercent.textContent = `${percentage}%`
  progressMessage.textContent = completedCount === moduleButtons.length
    ? 'Ruta completa. Ya puedes desplegar tu primer proyecto.'
    : completedCount === 0
      ? 'El primer punto siempre es el más importante.'
      : 'Buen ritmo. Cada módulo suma una pieza nueva.'
}

moduleButtons.forEach((button) => {
  const moduleNumber = Number(button.dataset.module)
  const moduleCard = button.closest('.module-card')
  const viewButton = document.createElement('button')
  viewButton.className = 'module-view'
  viewButton.type = 'button'
  viewButton.innerHTML = 'Ver módulo <span aria-hidden="true">→</span>'
  moduleCard.insertBefore(viewButton, button)

  viewButton.addEventListener('click', () => openModule(moduleNumber))

  if (savedModules.includes(moduleNumber)) {
    button.classList.add('is-done')
    button.textContent = '✓'
  }

  button.addEventListener('click', () => {
    const isDone = button.classList.toggle('is-done')
    button.textContent = isDone ? '✓' : '○'
    const completedModules = [...document.querySelectorAll('.module-action.is-done')]
      .map((completedButton) => Number(completedButton.dataset.module))
    localStorage.setItem('azure-course-progress', JSON.stringify(completedModules))
    updateProgress()
  })
})

updateProgress()

function openModule(moduleNumber) {
  const detail = moduleDetails[moduleNumber]
  const dialog = document.createElement('dialog')
  dialog.className = 'module-dialog'
  dialog.innerHTML = `<button class="dialog-close" type="button" aria-label="Cerrar módulo">×</button><div class="section-kicker">MÓDULO ${String(moduleNumber).padStart(2, '0')}</div><h2>${detail.title}</h2><p class="dialog-summary">${detail.summary}</p><div class="dialog-columns"><div><small>EN ESTE MÓDULO</small><p>${detail.topics}</p></div><div><small>AL TERMINAR</small><p>${detail.practice}</p></div></div><button class="button button-primary dialog-progress" type="button">Marcar como completado <span aria-hidden="true">✓</span></button>`
  document.body.append(dialog)
  dialog.showModal()

  const closeDialog = () => {
    dialog.close()
    dialog.remove()
  }
  dialog.querySelector('.dialog-close').addEventListener('click', closeDialog)
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog()
  })
  dialog.querySelector('.dialog-progress').addEventListener('click', () => {
    const progressButton = document.querySelector(`[data-module="${moduleNumber}"]`)
    if (!progressButton.classList.contains('is-done')) progressButton.click()
    closeDialog()
  })
}
