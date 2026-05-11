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
    // TODO: confirm exact street address. Coords are from Google Maps redirect.
    address: "Queens, NY",
    coords: { lat: 40.7556909, lng: -73.882144 },
    hours: "Mon–Sun · 11am – 11pm", // TODO: confirm
  },
  contact: {
    email: "hello@hotdogmaracay.nyc", // TODO: confirm real email
  },
} as const;
