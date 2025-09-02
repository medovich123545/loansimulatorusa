document.addEventListener("DOMContentLoaded", () => {
  // Ajustement du taux selon le credit score
  function adjustRate(baseRate, score) {
    let delta = 0;
    if (score >= 800) delta = -0.0025;
    else if (score >= 760) delta = -0.00125;
    else if (score >= 700) delta = 0;
    else if (score >= 660) delta = 0.00125;
    else if (score >= 620) delta = 0.0025;
    else delta = 0.005;
    return baseRate + delta;
  }

  // Onglets
  const tabs = document.querySelectorAll(".tabs button");
  const sections = {
    mortgage: document.getElementById("mortgage-fields"),
    personal: document.getElementById("personal-fields"),
    auto: document.getElementById("auto-fields"),
    business: document.getElementById("business-fields")
  };
  let current = "mortgage";
  tabs.forEach(tab => tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    current = tab.dataset.cat;
    Object.keys(sections).forEach(k => {
      sections[k].style.display = k === current ? "block" : "none";
    });
    validateInputs();
  }));

  // Sélecteur de banque
  const selectedBank = document.getElementById("selectedBank");
  const bankOptions = document.getElementById("bankOptions");
  bankOptions.querySelectorAll("li").forEach(li => {
    li.addEventListener("click", () => {
      selectedBank.innerHTML = "";
      selectedBank.appendChild(li.querySelector("img").cloneNode(true));
      ["mortgage","personal","auto","biz"].forEach(type => {
        selectedBank.dataset[type + "Rate"] = li.dataset[type + "Rate"];
      });
      bankOptions.classList.add("hidden");
      selectedBank.setAttribute("aria-expanded", "false");
      validateInputs();
    });
  });
  selectedBank.addEventListener("click", () => {
    const exp = selectedBank.getAttribute("aria-expanded")==="true";
    selectedBank.setAttribute("aria-expanded", String(!exp));
    bankOptions.classList.toggle("hidden");
  });
  document.addEventListener("click", e => {
    if (!document.getElementById("bankSelect").contains(e.target)) {
      selectedBank.setAttribute("aria-expanded", "false");
      bankOptions.classList.add("hidden");
    }
  });

  // Validation & affichage des valeurs
  const inputs = Array.from(document.querySelectorAll("input"));
  const calcBtn = document.getElementById("calculate");
  function validateInputs() {
    let ready = false;
    if (current==="mortgage") ready = +document.getElementById("price").value > 0;
    else if (current==="personal") ready = +document.getElementById("personalAmount").value > 0;
    else if (current==="auto") ready = +document.getElementById("autoPrice").value > 0;
    else ready = +document.getElementById("bizAmount").value > 0;
    calcBtn.disabled = !ready;
  }
  inputs.forEach(i => i.addEventListener("input", validateInputs));

  // Affichage des ranges
  [
    ["price","priceVal"],["downPayment","dpVal"],
    ["autoPrice","autoPriceVal"],["autoDownPayment","autoDpVal"],
    ["duration","durationVal"]
  ].forEach(([id, disp]) => {
    const inp = document.getElementById(id), out = document.getElementById(disp);
    inp.addEventListener("input", () => out.textContent = inp.value);
  });

  // Calcul et génération du planning
  let schedule = [];
  calcBtn.addEventListener("click", () => {
    const years = +document.getElementById("duration").value;
    const n = years * 12;
    let rate = parseFloat(selectedBank.dataset[current + "Rate"]);
    rate = adjustRate(rate, +document.getElementById("creditScore").value);
    if (document.getElementById("autoPay").checked) rate -= 0.005;

    let principal;
    if (current==="mortgage") {
      const p = +document.getElementById("price").value;
      const dp = +document.getElementById("downPayment").value;
      principal = p * (1 - dp/100);
    } else if (current==="personal") {
      principal = +document.getElementById("personalAmount").value;
    } else if (current==="auto") {
      const ap = +document.getElementById("autoPrice").value;
      const adp = +document.getElementById("autoDownPayment").value;
      principal = ap * (1 - adp/100);
    } else {
      principal = +document.getElementById("bizAmount").value;
    }

    const origFee = principal * 0.01;
    const mRate = rate/12;
    const monthly = (principal * mRate) / (1 - Math.pow(1 + mRate, -n));
    const apr = Math.pow((monthly*n + origFee)/principal, 1/years) - 1;
    const totalCost = monthly*n + origFee - principal;

    document.getElementById("monthly").textContent = `$${monthly.toFixed(2)}`;
    document.getElementById("apr").textContent = `${(apr*100).toFixed(2)}%`;
    document.getElementById("totalCost").textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById("usedRate").textContent = `${(rate*100).toFixed(3)}%`;

    // Génération du tableau d'amortissement
    schedule = [];
    let balance = principal;
    for (let i = 1; i <= n; i++) {
      const interest = balance * mRate;
      const principalPaid = monthly - interest;
      balance -= principalPaid;
      schedule.push({i, payment: monthly, interest, principalPaid, balance: Math.max(balance,0)});
    }
    document.getElementById("showSchedule").disabled = false;
  });

  // Affichage et export du planning
  document.getElementById("showSchedule").addEventListener("click", () => {
    const tbody = document.querySelector("#amortTable tbody");
    tbody.innerHTML = "";
    schedule.forEach(r => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${r.i}</td><td>$${r.payment.toFixed(2)}</td><td>$${r.interest.toFixed(2)}</td><td>$${r.principalPaid.toFixed(2)}</td><td>$${r.balance.toFixed(2)}</td>`;
      tbody.appendChild(tr);
    });
    document.getElementById("schedule").style.display = "block";

    const csv = [["#","Payment","Interest","Principal","Balance"], ...schedule.map(r =>
      [r.i, r.payment.toFixed(2), r.interest.toFixed(2), r.principalPaid.toFixed(2), r.balance.toFixed(2)]
    )].map(row => row.join(",")).join("\n");
    document.getElementById("exportCsv").href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  });
});
/* ======================================================
   SITE FOOTER Remonte
   ====================================================== */
 document.querySelectorAll('a[href="#simulator"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.getElementById('main-nav');

  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open'); // Affiche/masque le menu
  });
});

