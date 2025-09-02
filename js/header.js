
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', (!expanded).toString());

    // Optionnel : animer les barres du hamburger
    hamburger.querySelectorAll('span').forEach((bar, i) => {
      bar.style.transform = nav.classList.contains('active')
        ? ['rotate(45deg) translate(5px, 5px)', 'opacity(0)', 'rotate(-45deg) translate(5px,-5px)'][i]
        : 'none';
    });
  });

