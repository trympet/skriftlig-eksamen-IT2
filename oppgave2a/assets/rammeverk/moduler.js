// @ts-check

/** Bildegalleri interface som tilbyr metoder tilknyttet bildegalleriet for å manipulere galleriets utseende på dokumentet */
export class BildeGalleri extends HTMLElement {
  /**
   * Lager bildegalleri i form av et HTMLElement
   * @param {Array} bilder - Array med filnavn + filtype til bildene som skal vises i galleriet
   * @param {String} path - Filpath til bildene. Eks: 'assets/img/'
   * @param {{automatisk: false, visNav: true}} [alternativer] - Valgfrie parametere. Automatisk: autorotasjon mellom bildene, visNav: vise navigasjonspiler
   */
  constructor(
    bilder,
    path = '',
    { automatisk = false, visNav = true } = { automatisk: false, visNav: true }
  ) {
    super(); // etablerer prototypekjeden
    this.innerHTML = '';
    this.indeks = 0; // indeksen til gjeldende bilde
    this.nodeList; // Nodelist med HTMLImage-elementer
    this.bildeNavn = bilder; // array med bildenavn
    this.path = path;
    this.automatisk = automatisk;
    this.visNav = visNav;
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('bildegalleri');
    this.genererBilder();

    if (this.visNav) {
      // knapp for å navigere til forrige bilde
      const forrige = document.createElement('a');
      forrige.innerHTML = '&#10094;';
      forrige.style.left = '0';
      forrige.addEventListener('click', this.forrige.bind(this));
      forrige.className = 'galleri-nav';
      this.wrapper.appendChild(forrige);

      // knapp for å navigere til neste bilde
      const neste = document.createElement('a');
      neste.innerHTML = '&#10095;';
      neste.style.right = '0';
      neste.addEventListener('click', this.neste.bind(this));
      neste.className = 'galleri-nav';
      this.wrapper.appendChild(neste);
    }

    // stiler for bildene og navigasjonsknappene
    const stiler = document.createElement('style');
    // høyden og bredden til bildegalleriet spesifiseres i .bildegalleri
    stiler.textContent = `
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .bildegalleri {
      height: 480px;
      width: 600px;
      position: relative;
      display: inline-block;
    }
    /* stiler for navigasjonspilene */
    
    .galleri-nav {
      display: inline!important;
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      margin-top: -22px;
      padding: 16px;
      color: rgba(255,255,255,0.5);
      font-weight: bold;
      background-color: rgba(0,0,0,0.3);
    }
    .galleri-nav:hover {
      background-color: rgba(0,0,0,0.8);
      color: rgba(255,255,255,1);
    }`;

    this.oppdater();

    this.appendChild(stiler);
    this.appendChild(this.wrapper);

    // neste bilde hvert 5. sekund
    if (this.automatisk) {
      setTimeout(this.neste.bind(this), 5000);
    }
  }

  /** Lager og fester bildeelementer til wrapper */
  genererBilder() {
    this.bildeNavn.forEach(bilde => {
      // HTMLImageElement for hvert bildenavn
      const img = document.createElement('img');
      img.src = `${this.path}${bilde}`;
      img.className = 'galleri-bilde';
      img.alt = bilde;
      this.wrapper.appendChild(img);
    });
    this.nodeList = this.wrapper.querySelectorAll('img.galleri-bilde');
  }

  /** Navigerer til neste bilde */
  neste() {
    const gammeltBilde = this.nodeList[this.indeks];
    if (this.indeks + 1 > this.nodeList.length - 1) {
      this.indeks = 0;
    } else {
      this.indeks++;
    }
    const nyttBilde = this.nodeList[this.indeks];
    this.animer(gammeltBilde, nyttBilde).addEventListener(
      'finish',
      this.oppdater.bind(this),
      { once: true }
    );
  }

  /** Navigerer til forrige bilde */
  forrige() {
    const gammeltBilde = this.nodeList[this.indeks];
    if (this.indeks - 1 < 0) {
      this.indeks = this.nodeList.length - 1;
    } else {
      this.indeks--;
    }
    const nyttBilde = this.nodeList[this.indeks];
    this.animer(gammeltBilde, nyttBilde).addEventListener(
      'finish',
      this.oppdater.bind(this),
      { once: true }
    );
  }

  /**
   * Animerer gammelt element ut og nytt element inn
   * @param {Element} gammelt - element som skal animeres ut
   * @param {Element} nytt - element som skal animeres inn
   * @returns {Animation}
   */
  animer(gammelt, nytt) {
    gammelt.animate(
      [
        // fra synlig til usynlig
        { opacity: '1' },
        { opacity: '0' },
      ],
      400
    );
    nytt.style.display = 'block'; // nytt element er block, ikke none
    return nytt.animate(
      [
        // fra usynlig til synlig
        { opacity: '0' },
        { opacity: '1' },
      ],
      400
    );
  }

  /** Oppdaterer hvilke elementer som er synlig og hvilke som er usynlig */
  oppdater() {
    for (let i = 0; i < this.nodeList.length; i++) {
      this.nodeList[i].style.display = 'none';
    }
    this.nodeList[this.indeks].style.display = 'block';
  }
}
customElements.define('app-bildegalleri', BildeGalleri); // definerer BildeGalleri-interfacen

/** Lagre og manipulere array i localstorage */
export class LagreArray {
  /**
   * Validerer om en array finnes i localstorage
   * @param {String} key - Navn på arrayen
   * @returns {Boolean} - Returnerer TRUE hvis arrayen finnes
   */
  static valider(key) {
    try {
      if (key.length == 0) throw 'Du må oppgi en array!!';
      return localStorage.getItem(key) ? true : false;
    } catch (e) {
      console.debug(e);
    }
  }

  /**
   * Initialiserer en array i localstorage hvis den ikke finnes fra før
   * @param {String} key - Navn på arrayen
   * @param {Array} array - Arrayen som skal lagres
   */
  static init(key, array = []) {
    if (!LagreArray.valider(key)) {
      localStorage.setItem(key, JSON.stringify(array));
    }
  }

  /**
   * Henter en array fra localstorage
   * @param {String} key - Navn på arrayen
   * @returns {Array}
   */
  static hent(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * Mutere en array i localstorage
   * @param {String} key - Navn på arrayen
   * @param {('rm' | 'push')} handling - handling som skal utføres på arrayen: rm: fjern, push: tilføye
   * @param {String} string - string som handlingen skal utføres på
   */
  static endre(key, handling, string) {
    try {
      if (localStorage.getItem(key)) {
        //henter array
        let tmp = JSON.parse(localStorage.getItem(key));

        switch (true) {
          case handling === 'rm':
            if (tmp.includes(string)) {
              tmp.splice(tmp.indexOf(string), 1); // fjerner string
            } else {
              throw 'String finnes ikke i array';
            }
            break;
          case handling === 'push':
            tmp.push(string); // tilføyer string
            break;
          default:
            throw 'Ingen gyldige operasjonstyper spesifisert';
        }
        localStorage.setItem(key, JSON.stringify(tmp)); // lagrer midlertidig array
        console.debug('%carray oppdatert', 'color: blue');
      } else {
        throw 'Array ikke funnet';
      }
    } catch (feil) {
      console.error(feil);
    }
  }
}

/** Dialogboks interface som tilbyr metoder tilknyttet dialogboksen for å manipulere dialogboksens utseende på dokumentet */
export class DialogBoks extends HTMLElement {
  /**
   * Lage en dialogboks
   * @param {String} overskrift - Overskriften til dialogboksen
   * @param {HTMLDivElement} bodyElement - HTMLElement med body-innholdet til dialogboksen
   * @param {{lukk:true, ok:false}} [alternativer] - lukk: om det skal vises lukk-knapp, ok: om det skal vises ok-knapp
   */
  constructor(
    overskrift,
    bodyElement,
    { lukk = true, ok = false } = { lukk: true, ok: false }
  ) {
    super(); // etablerer prototypekjeden

    this.innerHTML = ''; // hvis elementet kalles inline skjer ingenting
    this.overskrift = document.createElement('h5');
    this.overskrift.textContent = overskrift;
    this.body = bodyElement; // bodyen til dialogboksen
    this.lukk = lukk;
    this.ok = ok;
    this.wrapper = document.createElement('div'); // wrapper for innholdet i dialogboksen
    this.wrapper.style.transform = 'scale(0)'; // skjuler dialogboksen
    this.wrapper.className = 'dialogboks';
    this.bakgrunn = document.createElement('div'); // bakgrunn som skjuler innholdet bak dialogboksen
    this.bakgrunn.className = 'bakgrunn';

    this.header = document.createElement('div'); // header
    this.header.className = 'header';
    this.header.appendChild(this.overskrift);
    this.body.classList.add('body');
  }
  /**
   * Kjøres hver gang elementet blir appendet til et element som er festet til dokumentet
   * Genererer dialogboksen og fester underelementer til DialogBoks-elementet
   */
  connectedCallback() {
    // fester alle elementer til et shadowroot-dokument for å unngå css-konflikter
    const shadowRoot = this.attachShadow({ mode: 'open' });

    const footer = document.createElement('div');
    footer.className = 'footer';

    // lukk-knapp i footer
    if (this.lukk) {
      const lukkKnapp = document.createElement('button');
      lukkKnapp.addEventListener('click', this.skjul.bind(this));
      lukkKnapp.innerText = 'Lukk';
      footer.appendChild(lukkKnapp);
      this.bakgrunn.addEventListener('click', event => {
        // lukker dialogboks når man klikker på bakgrunn
        if (event.currentTarget === this.bakgrunn) {
          this.skjul();
        }
      });
    }

    // ok-knapp i footer
    if (this.ok) {
      const okKnapp = document.createElement('button');
      okKnapp.addEventListener('click', this.skjul.bind(this));
      okKnapp.addEventListener('click', () =>
        this.dispatchEvent(new CustomEvent('ok'))
      ); // ok-eventlistener når lukkes
      okKnapp.innerText = 'Ok';
      footer.appendChild(okKnapp);
    }

    this.wrapper.appendChild(this.header);
    this.wrapper.appendChild(this.body);
    this.wrapper.appendChild(footer);
    shadowRoot.appendChild(this.wrapper);
    shadowRoot.appendChild(this.bakgrunn);

    const stiler = document.createElement('style');
    stiler.textContent = `
    h1, h2, h3, h4, h5 {
      display: inline;
    }
    .dialogboks {
      top: 5rem;
      left: 5rem;
      right: 5rem;
      position: fixed;
      pointer-events: auto!important;
      background-color: #fff;
      box-shadow: 0 5px 11px 0 rgba(0,0,0,.18), 0 4px 15px 0 rgba(0,0,0,.15);
      border: 0;
      border-radius: .125rem;
      min-width: 500px;
      width: auto;
      margin: 1.75rem auto;
      z-index: 2;
      transition: transform .5s;
    }
    .header {
      border-top-left-radius: .125rem;
      border-top-right-radius: .125rem;
      border-bottom: 1px solid #dee2e6;
      padding: 1rem;
    }
    .header h5 {
      line-height: 1.5;
      font-size: 1.8rem;
    }
    .body {
      font-size: 1rem;
      position: relative;
      flex: 1 1 auto;
      padding: 1rem;
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 1rem;
      border-top: 1px solid #dee2e6;
      border-bottom-right-radius: .3rem;
      border-bottom-left-radius: .3rem;
    }
    .footer button {
      cursor: pointer;
      background-color: #a6c!important;
      color: #fff;
      box-shadow: 0 2px 5px 0 rgba(0,0,0,.16), 0 2px 10px 0 rgba(0,0,0,.12);
      padding: .84rem 2.14rem;
      font-size: .81rem;
      margin: .375rem;
      border: 0;
      border-radius: .125rem;
      text-transform: uppercase;
      white-space: normal;
      word-wrap: break-word;
    }
    .bakgrunn {
      opacity: 0;
      cursor: pointer;
      transition: opacity .5s;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #000;
      z-index: 1;
      visibility: hidden;
    }
    .skjult {
      opacity: .5;
      visibility: visible!important;
    }
    `;
    shadowRoot.appendChild(stiler);
  }
  /** Åpner dialogboksen */
  vis() {
    this.wrapper.style.transform = 'scale(1)';
    this.bakgrunn.classList.add('skjult');
    this.dispatchEvent(new CustomEvent('åpnet')); // sender event når dialogboksen åpnes
  }
  /** Lukker dialogboksen */
  skjul() {
    this.wrapper.style.transform = 'scale(0)';
    this.bakgrunn.classList.remove('skjult');
    this.dispatchEvent(new CustomEvent('lukket')); // sender event når dialogboksen lukkes
  }
}
customElements.define('app-dialogboks', DialogBoks); // definerer DialogBoks-elementet

/**
 * Interface som lar deg lage et diagram for å illustrere data i form av pai eller stolpe.
 * Klassen extender HTMLElement, ikke SVGElement, jf. World Wide Web Consortium Custom Elements § 4.7, se https://w3c.github.io/webcomponents/spec/custom/#dom-elements
 */
export class Diagram extends HTMLElement {
  /**
   *
   * @param {Array.<{prosent: Number, farge: String, navn: String}>} data - Data som bygger opp diagrammet. prosent: prosentveri i desimal, farge: css farge for elementet, type: pai eller stolpe, navn: navnet til elementet
   * @param {String} type - pai eller stolpe
   * @param {String} [navn] - overskrift til illustrasjonen
   */
  constructor(data, type, navn) {
    super(); // etablerer prototypekjeden
    this.innerHTML = '';
    this.wrapper = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    this.data = data;
    this.type = type;
    this.navn = navn;
    this.kumulativProsent = 0;
  }
  connectedCallback() {
    this.innerHTML = '';
    switch (this.type) {
      case 'pai':
        this.paiDiagram();
        break;
      case 'stolpe':
        this.stolpeDiagram();
        break;
      default:
        break;
    }
    this.appendChild(this.wrapper);
  }
  /** Gjør om prosentverdier til koordinater i en sirkel */
  hentKoordinaterForProsent(prosent) {
    const x = Math.cos(2 * Math.PI * prosent);
    const y = Math.sin(2 * Math.PI * prosent);
    return [x, y];
  }
  paiDiagram() {
    let yTextVerdi = -0.8;
    this.wrapper.setAttribute('viewBox', '-2 -1 3 3');
    this.wrapper.style.transform = 'rotate(-90deg)';
    this.wrapper.style.height = '200px';
    this.data.forEach(sektor => {
      // lager sektoere
      const [startX, startY] = this.hentKoordinaterForProsent(
        this.kumulativProsent
      );
      this.kumulativProsent += sektor.prosent;
      const [sluttX, sluttY] = this.hentKoordinaterForProsent(
        this.kumulativProsent
      );
      const storBue = sektor.prosent > 0.5 ? 1 : 0;
      const data = `M ${startX} ${startY} A 1 1 0 ${storBue} 1 ${sluttX} ${sluttY} L 0 0`;
      const pathElement = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path'
      );
      pathElement.setAttribute('d', data);
      pathElement.setAttribute('fill', sektor.farge);
      this.wrapper.appendChild(pathElement);

      // label for hver sektor
      const label = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      );
      label.textContent = sektor.navn;
      label.setAttribute('x', '1.3');
      label.setAttribute('y', yTextVerdi.toString());
      label.style.fontSize = '0.2px';
      label.style.transform = 'rotate(90deg)'; // roterer 90 grader tilbake
      this.wrapper.appendChild(label);

      const rect = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'rect'
      );
      rect.style.transform = 'rotate(90deg)'; // roterer 90 grader tilbake
      rect.setAttribute('x', '1.1');
      rect.setAttribute('y', (yTextVerdi - 0.12).toString());
      rect.setAttribute('height', '0.15');
      rect.setAttribute('width', '0.15');
      rect.style.fill = sektor.farge;
      this.wrapper.appendChild(rect);

      yTextVerdi += 0.2;
    });
  }
  stolpeDiagram() {}
}
customElements.define('app-diagram', Diagram); // definerer DialogBoks-elementet

/** Metoder for å validere om en verdi er av spesifisert type */
export class Validator {
  /**
   * Tester en verdi mot et RegEx-uttrykk
   * @param {*} verdi - verien du ønsker å teste
   * @param {RegExp} regEx - RegEx-uttrykket du ønsker å validere mot
   */
  static mønster(verdi, regEx) {
    return regEx.test(verdi);
  }
  /**
   * Validerer om en verdi er av typen Number
   * @param {*} verdi - verien du ønsker å teste
   */
  static erNummer(verdi) {
    return typeof verdi === 'number' && !isNaN(verdi);
  }
  /**
   * Validerer om en verdi er av typen Integer (heltall)
   * @param {*} verdi - verien du ønsker å teste
   */
  static erInteger(verdi) {
    return /^-?\d+$/.test(verdi);
  }
  /**
   * Validerer om en verdi er en tom string
   * @param {*} verdi - verien du ønsker å teste
   */
  static erTomString(verdi) {
    return verdi === '';
  }
  /**
   * Validerer om en verdi er et positivt integer (heltall)
   * @param {*} verdi - verien du ønsker å teste
   */
  static erPositivInt(verdi) {
    return /^\d+$/.test(verdi);
  }
  /**
   * Validerer om en verdi er et positivt tall
   * @param {*} verdi - verien du ønsker å teste
   */
  static erPositivNum(verdi) {
    return /^\d*\.?\d+$/.test(verdi);
  }
}
