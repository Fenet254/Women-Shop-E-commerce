  function toggleMenu() {
    const menu = document.getElementById('menuDropdown');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  }
function openMenu() {
    document.getElementById("menu").style.display = "block";
    setTimeout(closeMenu, 1000);
}
function closeMenu() {
    document.getElementById("menu").style.display = "none";
}




