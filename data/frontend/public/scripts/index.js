const body = document.body
const toggleBtn = document.querySelector('#theme-toggle')
const currentTheme = localStorage.getItem('theme') || 'light' 

if(currentTheme === 'light') {
  toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>'
}
else {
  body.classList.add('dark-theme')  
  toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>'
}


toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-theme')
  if(body.classList.contains('dark-theme')) {
    toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    localStorage.setItem('theme', 'dark')
  }
  else {
    toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('theme', 'light')
  }
})