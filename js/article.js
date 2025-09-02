// ==============================
// BOUTON RETOUR EN HAUT
// ==============================
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ==============================
// SEARCH & HIGHLIGHT SYSTEM
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("header-search-input");
  const container = document.getElementById("search-container");

  if (!input || !container) return;

  // Supprimer les anciens surlignages
  function removeHighlights() {
    const marks = container.querySelectorAll("mark.search-highlight");
    marks.forEach(mark => {
      const parent = mark.parentNode;
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    });
  }

  // Fonction récursive pour surligner
  function highlightText(node, regex) {
    if (node.nodeType === 3) { // texte brut
      const matches = node.data.match(regex);
      if (matches) {
        const span = document.createElement("span");
        let lastIndex = 0;

        node.data.replace(regex, (match, index) => {
          span.appendChild(document.createTextNode(node.data.substring(lastIndex, index)));

          const mark = document.createElement("mark");
          mark.className = "search-highlight";
          mark.textContent = match;
          span.appendChild(mark);

          lastIndex = index + match.length;
        });

        span.appendChild(document.createTextNode(node.data.substring(lastIndex)));
        node.parentNode.replaceChild(span, node);
      }
    } else if (node.nodeType === 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
      Array.from(node.childNodes).forEach(child => highlightText(child, regex));
    }
  }

  // Fonction principale de recherche
  function searchAndHighlight(query) {
    removeHighlights();
    if (!query) return;
    const regex = new RegExp(query, "gi");
    highlightText(container, regex);

    // Scroll vers le premier résultat
    const first = container.querySelector("mark.search-highlight");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Lancer la recherche à l'appui de "Entrée"
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchAndHighlight(input.value.trim());
    }
  });
});





// MENU MOBILE ROBUSTE (hamburger + overlay + fermeture au resize)
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('header nav');
  const overlay = document.getElementById('menuOverlay');

  if (!hamburger || !nav || !overlay) return;

  const openMenu = () => {
    hamburger.classList.add('active');
    nav.classList.add('open');
    overlay.classList.add('show');
    document.body.classList.add('no-scroll');
    hamburger.setAttribute('aria-expanded', 'true');
  };
  const closeMenu = () => {
    hamburger.classList.remove('active');
    nav.classList.remove('open');
    overlay.classList.remove('show');
    document.body.classList.remove('no-scroll');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // fermer quand on clique sur un lien du menu
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // si on redimensionne > 768 - on s'assure de fermer le menu et restaurer le layout desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  });
});
