//@ts-check

import { DialogBoks } from './assets/rammeverk/moduler.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('asd');
});

const bildeInfo = {
  bilde1: {
    filformat: {
      navn: 'JPEG',
      begrunnelse: `
      Anbefalt filformat er JPEG, fordi bildet ikke har noen usynlige elementer som benytter seg av
       alpha-kanalen. JPEG er også gunstig siden filformatet er lossy. Dette betyr at man kan spare
       plass og båndbredde til bruk på internett.
      `
    },
    datagrafikk: `punktgrafikk`
  },
  bilde2: {
    filformat: {
      navn: 'PNG',
      begrunnelse: `
      Anbefalt filformat er PNG. Dette er fordi bildet inneholder en alpha-kanal, som gjør bildet
      gjennomsiktig. For å kunne benytte seg av dette på internett er det vanligste filformatet
      med mest støtte PNG. Et annet alternativ er Google sitt nye WebP format, som lar deg lagre bildet
      både med alpha-kanal, samt ødeleggende komprimering. Desverre er Google Chrome den eneste
      nettleseren som støtter dette
      `
    },
    datagrafikk: `punktgrafikk`
  },
  bilde3: {
    filformat: {
      navn: 'SVG',
      begrunnelse: `
      Anbefalt filformat er SVG. Dette er fordi SVG er et vektorgrafikkformat som lar deg skalere (forstørre)
       bildetuendelig stort, mens man opprettholdet samme skarpheten uavhengig av størrelsen. Bildet har 
       heller ingen komplekse linjer eller skygger, noe som gjør bildet er optimalt til å lagres i vektorformat.
      `
    },
    datagrafikk: `vektorgrafikk`
  }
};

const bildeSjekk = event => {
  const bilde = event.target;
  const bildeNavn = bilde.dataset.bildenavn;
  console.log(bildeNavn);
  const infoElement = document.createElement('div');
  infoElement.innerHTML = `
    <p><strong>Anbefalt filformat:</strong> ${
      bildeInfo[bildeNavn].filformat.navn
    }.</p>
    <p>${bildeInfo[bildeNavn].filformat.begrunnelse}</p>
    <p><strong>Hovedtype for datagrafikk:</strong> ${
      bildeInfo[bildeNavn].datagrafikk
    }.</p>

  `;
  const dialogBoks = new DialogBoks('Informasjon om bildet', infoElement);
  document.body.appendChild(dialogBoks);
  dialogBoks.vis()
};

const bildeWrapper = document.querySelector('.bildewrapper');

bildeWrapper.addEventListener('click', bildeSjekk);
