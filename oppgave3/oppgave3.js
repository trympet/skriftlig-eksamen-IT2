//@ts-check

/* Jeg så ikke side 11 før 10 minutter før jeg skulle levere. Jeg har derfor laget en løsning hvor
 * brukeren selv kan velge hvor mange hytter han/hun ønsker å komponere ruten av. 
 * Man kan enkelt legge inn en avgrensning i koden som sier at iterator må ha verdien 5 for å
 * kunne foreta kalkulasjonen, og at når iterator er større enn 5 vil ikke funksjonen nyHytte()
 * kjøres. Da blir man tvunget til å lage en rute som består av tre hytter. Løsningen min gir derimot
 * rom for å utvide ruten uendelig stort, samtidig som den er effektiv.
 */

const hytter = {
  gjendesheim: [['glitterheim', 22], ['memurubu', 14]],
  glitterheim: [['gjendesheim', 22], ['memurubu', 18], ['spiterstulen', 17]],
  memurubu: [['gjendesheim', 14], ['glitterheim', 18], ['gjendebu', 10]],
  gjendebu: [
    ['memurubu', 10],
    ['leirvassbu', 19],
    ['spiterstulen', 24],
    ['olavsbu', 16]
  ],
  leirvassbu: [['gjendebu', 19], ['spiterstulen', 15], ['olavsbu', 11]],
  spiterstulen: [['glitterheim', 17], ['gjendebu', 24], ['leirvassbu', 15]],
  olavsbu: [['gjendebu', 16], ['leirvassbu', 11]]
};

const hytteForm = document.querySelector('#hytte-form');
const output = document.querySelector('.output');
const submitKnapp = document.querySelector('button[type=submit]');
submitKnapp.disabled = true;

let iterator = 1; // iterator som økes når en ny hytte legges til.

const nyHytte = forrigeHytte => {
  let optionHtml = '';

  if (forrigeHytte) {
    // forrige hytte er spesifisert og det vises kun hytter som går fra forrige hytte
    const hytte = hytter[forrigeHytte];
    for (let i = 0; i < hytte.length; i++) {
      const navn = hytte[i][0];
      const avstand = hytte[i][1];
      optionHtml += `<option value="${navn}">${navn} (avstand: ${avstand}km)</option>`;
    }
  } else {
    // ingen forrige hytte er spesifisert og alle hytter vises
    for (const hytte in hytter) {
      if (hytter.hasOwnProperty(hytte)) {
        optionHtml += `<option value="${hytte}">${hytte}</option>`;
      }
    }
  }

  const formRow = document.createElement('div');
  formRow.classList.add('form-row');
  formRow.innerHTML = `
    <div class="gruppe">
      <label for="hytte-${iterator}">Hytte ${iterator}</label>
      <select id="hytte-${iterator}" data-id="${iterator}">
        <option value="test" selected disabled>Velg hytte</option>
        ${optionHtml}
      </select>
    </div>
  `;
  hytteForm.append(formRow);
  iterator++;
};
/**
 * Henter avstander mellom hyttene som er valgt i select-inputsene, og printer disse til callbackfunksjonene.
 * @param {Function} printAvstand - callbackfunksjon som printer avstanden til brukeren
 * @param {Function} printTotal - callbackfunksjon som printer total avstand til brukeren
 */
const hentAvstander = (printAvstand, printTotal) => {
  let avstander = [];
  output.innerHTML = '';
  const hytteSelectorer = hytteForm.querySelectorAll('select'); // alle select elementer
  for (let i = 0; i < hytteSelectorer.length - 2; i++) {
    // for hvert select element untatt siste
    const selector1 = hytteSelectorer[i];
    const selector2 = hytteSelectorer[i + 1];
    const hytte1 = hytter[selector1.value];

    const avstandTilFra = hytte1.filter(
      hytte => hytte[0] == selector2.value
    )[0][1];
    avstander.push(avstandTilFra);
    printAvstand({
      fra: selector1.value,
      til: selector2.value,
      avstand: avstandTilFra
    });
  }
  printTotal(avstander.reduce((a, b) => a + b)); // printer summert avstand mellom hyttene
};

/**
 * Printer avstander mellom to hytter
 * @param {Object} parametere -  fra: avreisehytte, til, destinasjonshytte, avstand: avstand i kilometer
 */
const printAvstander = ({ fra, til, avstand }) => {
  output.innerHTML += `
  <p>Avstanden fra <span class="hyttenavn">${fra}</span>
   til <span class="hyttenavn">${til}</span> er ${avstand} kilometer.</p>
  `;
};
/**
 * Printer total avstand.
 * @param {Number} avstand - avstand i kilometer
 */
const printTotalAvstand = avstand => {
  output.innerHTML += `
  <p><strong>Total avstand for turen er <span class="total-avstand">${avstand} kilometer.</span></strong></p>
  `;
};
/**
 * Rutine for å beregne avstander mellom hytter
 */
const kalkuler = () => hentAvstander(printAvstander, printTotalAvstand);

hytteForm.addEventListener('change', event => {
  /* KODE FOR AVGRENSNING AV ANTALL HYTTER */
  // if (iterator > 3) {
  //   return
  // }
  const formRow = event.target.parentElement.parentElement; // raden til select-elementet

  if (formRow === hytteForm.lastElementChild) {
    // element som ble endret er siste select-element
    nyHytte(event.target.value);
  } else {
    // element som ble endret er ikke siste select-element
    for (let i = iterator - 1; i > parseInt(event.target.dataset.id); i--) {
      // fjerner alle hytte-selectorene under selectoren som ble endret
      hytteForm
        .querySelector(`#hytte-${i}`)
        .parentElement.parentElement.remove();
    }
    iterator = parseInt(event.target.dataset.id) + 1; // nullstiller iterator

    nyHytte(event.target.value); // genererer select input for ny hytte
  }

  /* KODE FOR AVGRENSNING AV ANTALL HYTTER */
  // if (iterator === 4) {
  //   submitKnapp.disabled = false;
  // } else {
  //   submitKnapp.disabled = true;
  // }

  // hvis det finnes færre enn 2 elementer som er valgt => submit = disabled
  if (iterator < 4) {
    submitKnapp.disabled = true;
  } else {
    // hvis man ønsker å ikke benytte seg av knapp kan man kalle funksjonen kalkuler() herfra isteden
    submitKnapp.disabled = false;
  }
});

submitKnapp.addEventListener('click', event => {
  // kalkulerer når bruker trykker på submitknapp
  event.preventDefault();
  kalkuler();
});

nyHytte(); // genererer det første select-inputet
