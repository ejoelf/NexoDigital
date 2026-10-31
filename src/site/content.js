// Contenido del sitio público de NexoDigital en español (es) e italiano (it).
// Para cambiar un texto, editalo acá: los componentes no tienen textos fijos.

export const CONTACT = {
  whatsappNumber: "5493585729499",
  whatsappDisplay: "+54 9 358 572-9499",
  email: "contacto.nexod@gmail.com",
  instagram: "https://www.instagram.com/nexodigital_ar/",
  facebook: "https://www.facebook.com/people/Nexodigital/61585696221610/",
};

export const SITE_URL = "https://nexodigital-ix6r.onrender.com";

export function whatsappLink(message) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Rutas por idioma. El español es el idioma principal y vive en la raíz.
export const ROUTES = {
  es: { home: "/", privacy: "/privacidad" },
  it: { home: "/it", privacy: "/it/privacy" },
};

const CASES_BASE = [
  {
    id: "nico-galicia",
    name: "Nico Galicia Stylist Mens",
    image: "/projects/nico-galicia-cover.svg",
    url: "https://nicogaliciastylistmens.com/",
    status: "published",
  },
  {
    id: "cf-metalpintura",
    name: "CF Metal-Pintura",
    image: "/projects/cf-metalpintura.webp",
    url: "https://cfmetalpintura.vercel.app/",
    status: "published",
  },
  {
    id: "electricidad-zacarias",
    name: "Electricidad Zacarías",
    image: "/projects/electricidad-zacarias-cover-v2.svg",
    url: "https://electricidad-zacarias.vercel.app/",
    status: "published",
  },
  {
    id: "tapiceria-lider",
    name: "Tapicería Líder",
    image: "/projects/tapiceria-lider-cover-v2.svg",
    url: "",
    status: "soon",
  },
];

const CASES_TEXT = {
  es: {
    "nico-galicia": {
      industry: "Barbería",
      description: "Web con reserva de turnos online y panel de gestión.",
    },
    "cf-metalpintura": {
      industry: "Metalúrgica y pintura",
      description: "Web que presenta sus servicios y recibe consultas.",
    },
    "electricidad-zacarias": {
      industry: "Servicios eléctricos",
      description: "Web para presentar sus servicios y captar clientes.",
    },
    "tapiceria-lider": {
      industry: "Tapicería automotor",
      description: "Galería de trabajos y contacto directo.",
    },
  },
  it: {
    "nico-galicia": {
      industry: "Barbiere",
      description: "Sito con prenotazione online e pannello di gestione.",
    },
    "cf-metalpintura": {
      industry: "Carpenteria metallica e verniciatura",
      description: "Sito che presenta i servizi e riceve richieste.",
    },
    "electricidad-zacarias": {
      industry: "Servizi elettrici",
      description: "Sito per presentare i servizi e trovare nuovi clienti.",
    },
    "tapiceria-lider": {
      industry: "Tappezzeria auto",
      description: "Galleria di lavori e contatto diretto.",
    },
  },
};

export function getCases(lang) {
  return CASES_BASE.map((item) => ({ ...item, ...CASES_TEXT[lang][item.id] }));
}

export const TEXT = {
  es: {
    meta: {
      title: "NexoDigital | Webs, software y automatización con IA",
      description:
        "Creamos webs, software a medida y automatizaciones con inteligencia artificial para negocios que quieren crecer. Trabajo remoto para todo el mundo.",
      privacyTitle: "Política de privacidad | NexoDigital",
    },
    nav: {
      label: "Navegación principal",
      services: "Servicios",
      cases: "Casos",
      process: "Proceso",
      about: "Sobre mí",
      contact: "Contacto",
      language: "Idioma",
    },
    whatsappMessage: "Hola NexoDigital, quiero consultar por un proyecto.",
    hero: {
      eyebrow: "Agencia digital · Trabajo remoto para todo el mundo",
      title: "Creamos webs, software y automatizaciones para negocios que quieren crecer.",
      subtitle: "Cada solución se adapta a tu rubro y a la forma en que trabajás.",
      primary: "Pedí tu presupuesto",
      secondary: "Ver casos",
      badge: "Diagnóstico de IA gratis",
    },
    services: {
      eyebrow: "Servicios",
      title: "Soluciones digitales a medida de tu negocio",
      free: "Gratis",
      items: [
        {
          id: "web",
          title: "Web comercial",
          text: "Presenta tu negocio y capta consultas.",
        },
        {
          id: "software",
          title: "Software a medida",
          text: "Turnos, CRM y paneles de gestión.",
        },
        {
          id: "automation",
          title: "Automatización con IA",
          text: "Respuestas y avisos sin tareas repetidas.",
        },
        {
          id: "diagnosis",
          title: "Diagnóstico de IA",
          text: "Analizamos tu negocio, te damos un informe y lo repasamos juntos en una reunión.",
          free: true,
        },
        {
          id: "presence",
          title: "Presencia digital",
          text: "Redes, contenido y marketing.",
        },
      ],
    },
    cases: {
      eyebrow: "Casos reales",
      title: "Proyectos publicados para negocios reales",
      visit: "Ver sitio",
      soon: "Próximamente",
    },
    process: {
      eyebrow: "Cómo trabajamos",
      title: "Un proceso simple, en tres pasos",
      steps: [
        {
          title: "Entendemos tu negocio",
          text: "Conversamos para conocer cómo trabajás y qué querés mejorar.",
        },
        {
          title: "Proponemos un plan",
          text: "Te enviamos una propuesta clara, con alcance y presupuesto.",
        },
        {
          title: "Entregamos y acompañamos",
          text: "Publicamos la solución y seguimos a tu lado para mejorarla.",
        },
      ],
    },
    about: {
      eyebrow: "Sobre mí",
      name: "Joel",
      role: "Fundador de NexoDigital",
      photoAlt: "Joel, fundador de NexoDigital",
      paragraphs: [
        "Soy Joel, fundador de NexoDigital. Empecé en el desarrollo web con un curso fullstack y hoy combino programación e inteligencia artificial para crear soluciones a medida.",
        "Trabajo de forma remota desde Italia con negocios de Argentina y de cualquier parte del mundo. Me gusta entender cómo funciona cada negocio antes de proponer nada, porque la tecnología sirve solo si resuelve un problema real.",
      ],
    },
    contact: {
      title: "Contanos qué necesita tu negocio",
      subtitle: "Te respondemos en el día. El diagnóstico de IA es gratis.",
      whatsapp: "Escribir por WhatsApp",
      email: "Enviar un email",
      emailSubject: "Consulta desde la web",
    },
    footer: {
      tagline: "Soluciones digitales para negocios reales.",
      services: "Servicios",
      contact: "Contacto",
      rights: "Todos los derechos reservados.",
      privacy: "Política de privacidad",
      panel: "Panel privado",
    },
    floating: "Escribinos por WhatsApp",
    privacy: {
      back: "Volver al inicio",
      title: "Política de privacidad",
      updated: "Última actualización: 31 de octubre de 2026",
      sections: [
        {
          title: "Quién es responsable",
          text: "El responsable de este sitio es NexoDigital. Para cualquier consulta sobre tus datos podés escribir a {email}.",
        },
        {
          title: "Qué datos recibimos",
          text: "Este sitio no tiene formularios ni cuentas de usuario. Solo recibimos los datos que vos elijas compartir cuando nos escribís por WhatsApp o por email, por ejemplo tu nombre, tu número o dirección de correo y el contenido del mensaje.",
        },
        {
          title: "Para qué los usamos",
          text: "Usamos esos datos únicamente para responder tu consulta, preparar una propuesta y, si trabajamos juntos, llevar adelante el proyecto. No los vendemos ni los compartimos con terceros con fines comerciales.",
        },
        {
          title: "Servicios de terceros",
          text: "Los mensajes de WhatsApp y de email pasan por esos servicios, que los tratan según sus propias políticas de privacidad. El sitio está alojado en Render, que puede registrar datos técnicos de la visita, como la dirección IP, por motivos de seguridad y funcionamiento.",
        },
        {
          title: "Cookies",
          text: "Este sitio no usa cookies de seguimiento, publicidad ni analítica. Las tipografías se sirven desde el propio sitio, sin conexiones a servicios externos.",
        },
        {
          title: "Cuánto tiempo los guardamos",
          text: "Guardamos tus datos solo el tiempo necesario para responder tu consulta o durante la relación comercial, y después los eliminamos si nos lo pedís.",
        },
        {
          title: "Tus derechos",
          text: "Podés pedir en cualquier momento acceder a tus datos, corregirlos o eliminarlos escribiendo a {email}. Si estás en Argentina, te ampara la Ley 25.326 de Protección de Datos Personales. Si estás en la Unión Europea, tenés además los derechos del Reglamento General de Protección de Datos (RGPD) y podés presentar un reclamo ante la autoridad de control de tu país.",
        },
      ],
    },
  },
  it: {
    meta: {
      title: "NexoDigital | Siti web, software e automazione con IA",
      description:
        "Creiamo siti web, software su misura e automazioni con intelligenza artificiale per aziende che vogliono crescere. Lavoro da remoto in tutto il mondo.",
      privacyTitle: "Informativa sulla privacy | NexoDigital",
    },
    nav: {
      label: "Navigazione principale",
      services: "Servizi",
      cases: "Progetti",
      process: "Processo",
      about: "Chi sono",
      contact: "Contatti",
      language: "Lingua",
    },
    whatsappMessage: "Ciao NexoDigital, vorrei informazioni su un progetto.",
    hero: {
      eyebrow: "Agenzia digitale · Lavoro da remoto in tutto il mondo",
      title: "Creiamo siti web, software e automazioni per aziende che vogliono crescere.",
      subtitle: "Ogni soluzione si adatta al tuo settore e al tuo modo di lavorare.",
      primary: "Richiedi un preventivo",
      secondary: "Vedi i progetti",
      badge: "Diagnosi IA gratuita",
    },
    services: {
      eyebrow: "Servizi",
      title: "Soluzioni digitali su misura per la tua attività",
      free: "Gratis",
      items: [
        {
          id: "web",
          title: "Sito web aziendale",
          text: "Presenta la tua attività e ricevi richieste.",
        },
        {
          id: "software",
          title: "Software su misura",
          text: "Prenotazioni, CRM e pannelli di gestione.",
        },
        {
          id: "automation",
          title: "Automazione con IA",
          text: "Risposte e notifiche senza attività ripetitive.",
        },
        {
          id: "diagnosis",
          title: "Diagnosi IA",
          text: "Analizziamo la tua attività, ti consegniamo un report e lo vediamo insieme in una riunione.",
          free: true,
        },
        {
          id: "presence",
          title: "Presenza digitale",
          text: "Social, contenuti e marketing.",
        },
      ],
    },
    cases: {
      eyebrow: "Progetti",
      title: "Progetti pubblicati per attività reali",
      visit: "Vedi il sito",
      soon: "Prossimamente",
    },
    process: {
      eyebrow: "Come lavoriamo",
      title: "Un processo semplice, in tre passi",
      steps: [
        {
          title: "Capiamo la tua attività",
          text: "Parliamo per capire come lavori e cosa vuoi migliorare.",
        },
        {
          title: "Proponiamo un piano",
          text: "Ti inviamo una proposta chiara, con obiettivi e preventivo.",
        },
        {
          title: "Consegniamo e ti seguiamo",
          text: "Pubblichiamo la soluzione e restiamo al tuo fianco per migliorarla.",
        },
      ],
    },
    about: {
      eyebrow: "Chi sono",
      name: "Joel",
      role: "Fondatore di NexoDigital",
      photoAlt: "Joel, fondatore di NexoDigital",
      paragraphs: [
        "Sono Joel, fondatore di NexoDigital. Ho iniziato nello sviluppo web con un corso fullstack e oggi unisco programmazione e intelligenza artificiale per creare soluzioni su misura.",
        "Lavoro da remoto dall'Italia con aziende dell'Argentina e di qualsiasi parte del mondo. Prima di proporre qualsiasi cosa, mi piace capire come funziona ogni attività, perché la tecnologia serve solo se risolve un problema reale.",
      ],
    },
    contact: {
      title: "Raccontaci di cosa ha bisogno la tua attività",
      subtitle: "Ti rispondiamo in giornata. La diagnosi IA è gratuita.",
      whatsapp: "Scrivi su WhatsApp",
      email: "Invia un'email",
      emailSubject: "Richiesta dal sito web",
    },
    footer: {
      tagline: "Soluzioni digitali per attività reali.",
      services: "Servizi",
      contact: "Contatti",
      rights: "Tutti i diritti riservati.",
      privacy: "Informativa sulla privacy",
      panel: "Area riservata",
    },
    floating: "Scrivici su WhatsApp",
    privacy: {
      back: "Torna alla home",
      title: "Informativa sulla privacy",
      updated: "Ultimo aggiornamento: 31 ottobre 2026",
      sections: [
        {
          title: "Titolare del trattamento",
          text: "Il titolare di questo sito è NexoDigital. Per qualsiasi domanda sui tuoi dati puoi scrivere a {email}.",
        },
        {
          title: "Quali dati riceviamo",
          text: "Questo sito non ha moduli né account utente. Riceviamo solo i dati che scegli di condividere quando ci scrivi su WhatsApp o via email, ad esempio il tuo nome, il numero di telefono o l'indirizzo email e il contenuto del messaggio.",
        },
        {
          title: "Perché li usiamo",
          text: "Usiamo questi dati solo per rispondere alla tua richiesta, preparare una proposta e, se lavoriamo insieme, realizzare il progetto. Non li vendiamo né li condividiamo con terzi a fini commerciali.",
        },
        {
          title: "Servizi di terzi",
          text: "I messaggi WhatsApp ed email passano attraverso questi servizi, che li trattano secondo le proprie informative sulla privacy. Il sito è ospitato su Render, che può registrare dati tecnici della visita, come l'indirizzo IP, per motivi di sicurezza e funzionamento.",
        },
        {
          title: "Cookie",
          text: "Questo sito non usa cookie di tracciamento, pubblicità o analisi. I font sono serviti dal sito stesso, senza connessioni a servizi esterni.",
        },
        {
          title: "Per quanto tempo li conserviamo",
          text: "Conserviamo i tuoi dati solo per il tempo necessario a rispondere alla tua richiesta o per la durata del rapporto commerciale, e poi li cancelliamo se ce lo chiedi.",
        },
        {
          title: "I tuoi diritti",
          text: "In qualsiasi momento puoi chiedere di accedere ai tuoi dati, correggerli o cancellarli scrivendo a {email}. Se ti trovi nell'Unione Europea, hai i diritti previsti dal Regolamento generale sulla protezione dei dati (GDPR) e puoi presentare un reclamo al Garante per la protezione dei dati personali o all'autorità di controllo del tuo paese.",
        },
      ],
    },
  },
};
