import { links } from "./links";

export function restaurantSchemaJson(locale: "es" | "en"): string {
  const url =
    locale === "es"
      ? "https://hotdogmaracay.francces.co"
      : "https://hotdogmaracay.francces.co/en/";

  const lat = links.cart.coords.lat;
  const lng = links.cart.coords.lng;
  const ig = links.instagram;
  const tt = links.tiktok;

  return (
    `{"@context":"https://schema.org",` +
    `"@type":"Restaurant",` +
    `"name":"Hot Dog Maracay NYC",` +
    `"image":"https://hotdogmaracay.francces.co/logo.png",` +
    `"servesCuisine":"Venezuelan",` +
    `"priceRange":"$",` +
    `"address":{"@type":"PostalAddress","addressLocality":"Queens","addressRegion":"NY","addressCountry":"US"},` +
    `"geo":{"@type":"GeoCoordinates","latitude":${lat},"longitude":${lng}},` +
    `"url":"${url}",` +
    `"sameAs":["${ig}","${tt}"]}`
  );
}
