import { describe, it, expect } from "vitest";
import { links } from "./links";

describe("links", () => {
  it("exposes the Uber Eats store URL", () => {
    expect(links.uberEats).toMatch(/^https:\/\/www\.ubereats\.com\/store-browse-uuid\//);
  });

  it("exposes the WhatsApp ordering link", () => {
    expect(links.whatsapp).toMatch(/^https:\/\/wa\.link\//);
  });

  it("exposes Instagram, TikTok, Google Maps, Google Reviews", () => {
    expect(links.instagram).toContain("instagram.com/hotdogmaracay.nyc");
    expect(links.tiktok).toContain("tiktok.com/@hotdogmaracay.nyc");
    expect(links.googleMaps).toContain("maps.app.goo.gl");
    expect(links.googleReviews).toContain("maps.app.goo.gl");
  });

  it("exposes self-hosted menu PDFs (not Drive URLs)", () => {
    expect(links.menuPdf.es).toBe("/menu-es.pdf");
    expect(links.menuPdf.en).toBe("/menu-en.pdf");
  });

  it("exposes cart coordinates", () => {
    expect(links.cart.coords).toEqual({ lat: 40.7556909, lng: -73.882144 });
  });

  it("exposes the phone number for tel: links", () => {
    expect(links.contact.phone).toBe("+1 (347) 839-9352");
    expect(links.contact.phoneHref).toBe("tel:+13478399352");
  });
});
