import { Validator } from './assets/rammeverk/moduler.js'; // importerer validatorklasse

const kalkulatorForm = document.querySelector('#pikselkalkulator');
const submitKnapp = document.querySelector('form button');
submitKnapp.disabled = true;

const validerInput = () => {
  const input = kalkulatorForm.querySelectorAll('input');
  for (let i = 0; i < input.length; i++) {
    const element = input[i];
    const verdi = element.value;
    if (verdi === '') return true;
    if (!Validator.erNummer(parseFloat(verdi))) {
      element.classList.add('ugyldig');
      return true;
    }
    if (!Validator.erPositivNum(parseFloat(verdi))) {
      element.classList.add('ugyldig');
      return true;
    }
    if (parseFloat(verdi) === 0) {
      element.classList.add('ugyldig');
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

kalkulatorForm.addEventListener('submit', event => {
  event.preventDefault();
  const bredde = kalkulatorForm.querySelector('#bredde').value;
  const høyde = kalkulatorForm.querySelector('#høyde').value;
  console.log(bredde, høyde);

  const outputVerdier = pikselKalkulator(bredde, høyde);
  visOutput(outputVerdier);
});

const visOutput = verdier => {
  const outputElement = document.querySelector('.output');
  outputElement.innerHTML = `
  <p><strong>Antall piksler:</strong> ${verdier.piksler}</p>
  <p><strong>Antall megapiksler:</strong> ${verdier.megaPiksler}</p>
  `;
};

const pikselKalkulator = (bredde, høyde) => {
  console.log(bredde, høyde);

  const antallPiksler = parseInt(bredde) * parseInt(høyde);
  const antallMegaPiksler = antallPiksler / 1000000; // antall piksler / 1 000 000 (en million)
  return { piksler: antallPiksler, megaPiksler: antallMegaPiksler };
};
