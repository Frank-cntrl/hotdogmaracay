export const links = {
  uberEats:
    "https://www.ubereats.com/store-browse-uuid/900165af-7313-44a9-9a7e-5c96e83e7510?diningMode=DELIVERY",
  whatsapp: "https://wa.link/lrx2b6",
  instagram: "https://www.instagram.com/hotdogmaracay.nyc/",
  tiktok: "https://www.tiktok.com/@hotdogmaracay.nyc",
  googleMaps: "https://maps.app.goo.gl/JdbpqysHd7sWEYFx5",
  googleReviews: "https://maps.app.goo.gl/o5eePnXwZFDWmXYi8",
  menuPdf: {
    es: "/menu-es.pdf",
    en: "/menu-en.pdf",
  },
  cart: {
    // TODO: confirm exact street address (Google Maps blocks scraping; owner to fill in).
    address: "Queens, NY",
    coords: { lat: 40.7556909, lng: -73.882144 },
    hours: [
      { days: { es: "Lun – Jue", en: "Mon – Thu" }, time: "7 PM – 2 AM" },
      { days: { es: "Vie – Sáb", en: "Fri – Sat" }, time: "7 PM – 4 AM" },
      { days: { es: "Domingo", en: "Sunday" }, time: "7 PM – 2 AM" },
    ],
  },
  contact: {
    phone: "+1 (347) 839-9352",
    phoneHref: "tel:+13478399352",
  },
} as const;
