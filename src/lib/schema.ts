import { links } from "./links";

export function restaurantSchemaJson(locale: "es" | "en"): string {
  const url =
    locale === "es"
      ? "https://hotdogmaracay.francces.co"
      : "https://hotdogmaracay.francces.co/en/";

  const lat = links.cart.coords.lat;
  const lng = links.cart.coords.lng;
  const a = links.cart.addressParts;
  const ig = links.instagram;
  const tt = links.tiktok;
  const tel = links.contact.phoneHref.replace("tel:", "");

  // Opening hours per schema.org: e.g. "Mo-Th 19:00-02:00", "Fr-Sa 19:00-04:00", "Su 19:00-02:00"
  const openingHours = [
    "Mo-Th 19:00-02:00",
    "Fr-Sa 19:00-04:00",
    "Su 19:00-02:00",
  ];

  return (
    `{"@context":"https://schema.org",` +
    `"@type":"Restaurant",` +
    `"name":"Hot Dog Maracay NYC",` +
    `"image":"https://hotdogmaracay.francces.co/logo.png",` +
    `"servesCuisine":"Venezuelan",` +
    `"priceRange":"$",` +
    `"telephone":"${tel}",` +
    `"address":{"@type":"PostalAddress",` +
      `"streetAddress":"${a.street}",` +
      `"addressLocality":"${a.locality}",` +
      `"addressRegion":"${a.region}",` +
      `"postalCode":"${a.postalCode}",` +
      `"addressCountry":"${a.country}"},` +
    `"geo":{"@type":"GeoCoordinates","latitude":${lat},"longitude":${lng}},` +
    `"openingHours":${JSON.stringify(openingHours)},` +
    `"url":"${url}",` +
    `"sameAs":["${ig}","${tt}"]}`
  );
}
