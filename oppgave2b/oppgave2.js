import { Validator } from './assets/rammeverk/moduler.js'; // importerer validatorklasse

const kalkulatorForm = document.querySelector('#pikselkalkulator');
const submitKnapp = document.querySelector('form button');
submitKnapp.disabled = true;

/**
 * Validerer at alle <input> elementer har gyldige verdier
 * @returns {Boolean} - Returnerer TRUE hvis et element er ugyldig
 */
const validerInput = () => {
  const input = kalkulatorForm.querySelectorAll('input');
  for (let i = 0; i < input.length; i++) {
    const element = input[i];
    const verdi = element.value;

    if (verdi === '') return true; // inputelement er tomt

    if (element.id === 'bredde' && parseFloat(element.value) > 1920) {
      element.classList.add('ugyldig'); // inputelement har id 'bredde' og større enn 1920
      return true;
    }

    if (!Validator.erNummer(parseFloat(verdi))) {
      element.classList.add('ugyldig'); // inputelement er ikke nummer
      return true;
    }
    if (!Validator.erPositivNum(parseFloat(verdi))) {
      element.classList.add('ugyldig'); // inputelement er negativt
      return true;
    }
    if (parseFloat(verdi) === 0) {
      element.classList.add('ugyldig'); // inputelement er null
      return true;
    }
    element.classList.remove('ugyldig');
  }
  return false;
};

// validerer inputfelter når bruker taster skriver i inputelementene
kalkulatorForm.addEventListener('input', () => {
  submitKnapp.disabled = validerInput();
});

// kalkulerer når from er submittet
kalkulatorForm.addEventListener('submit', event => {
  event.preventDefault();

  const bredde = kalkulatorForm.querySelector('#bredde').value;
  const høyde = kalkulatorForm.querySelector('#høyde').value;

  const kalkulatorVerdier = pikselKalkulator(bredde, høyde);
  const format = avgjørFormat(bredde, høyde);

  visOutput(kalkulatorVerdier, format);
});

/**
 * Printer output og bilde
 * @param {Object} kalkulator - Antall piksler og mekapiksler fra pikselkalkulator
 * @param {String} format - Formatet til bredden og høyden
 */
const visOutput = (kalkulator, format) => {
  const outputElement = document.querySelector('.output');
  outputElement.innerHTML = `
  <p><strong>Antall piksler:</strong> ${kalkulator.piksler}</p>
  <p><strong>Antall megapiksler</strong> ${kalkulator.megaPiksler}</p>
  <img src="assets/media/${format}.jpg" style="margin: auto; display: block;">
  `;
};

/**
 * Kalkulerer antall piksler og megapiksler basert på bredde og høyde
 * @param {Number} bredde - antall piksler i bredden
 * @param {Number} høyde - antall piksler i høyden
 */
const pikselKalkulator = (bredde, høyde) => {
  console.log(bredde, høyde);

  const antallPiksler = parseInt(bredde) * parseInt(høyde);
  const antallMegaPiksler = antallPiksler / 1000000; // antall piksler / 1 000 000 (en million)
  return { piksler: antallPiksler, megaPiksler: antallMegaPiksler };
};

/**
 * Avgjør formatet bastert på bredde og høyde
 * @param {Number} bredde - antall piksler i bredden
 * @param {Number} høyde - antall piksler i høyden
 */
const avgjørFormat = (bredde, høyde) => {
  if (bredde === høyde) {
    return 'kvadratisk';
  }
  if (bredde > høyde) {
    return 'liggende';
  }
  return 'staende';
};
