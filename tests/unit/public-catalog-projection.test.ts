import { describe, expect, it } from "vitest";
import { projectPublicServiceAddons, projectPublicTestimonials } from "@/schemas/public-catalog";

describe("public catalog projections", () => {
  it("removes testimonial, project, photo, approval, and ordering IDs", () => {
    const photoId = "3de9e7de-0d17-4bb7-a855-6af168bd8841";
    const projectId = "dd3c40bb-d01d-4e55-9762-71a22e26466a";
    const output = projectPublicTestimonials(
      [{
        id: "741609fc-acbd-4315-a6e4-d6e53049b7ec",
        authorName: "Nadia",
        authorRole: "Pemilik usaha",
        quote: "Prosesnya jelas dan terarah.",
        photoId,
        projectId,
        isActive: true,
        sortOrder: 0,
      }],
      new Map([[photoId, {
        alt: "Nadia",
        urls: {
          thumb: "https://cdn.example.com/thumb.webp",
          card: "https://cdn.example.com/card.webp",
          hero: "https://cdn.example.com/hero.webp",
          og: "https://cdn.example.com/og.webp",
        },
      }]]),
    );

    expect(output).toEqual([{
      authorName: "Nadia",
      authorRole: "Pemilik usaha",
      quote: "Prosesnya jelas dan terarah.",
      photoUrl: "https://cdn.example.com/card.webp",
    }]);
    expect(JSON.stringify(output)).not.toContain(photoId);
    expect(JSON.stringify(output)).not.toContain(projectId);
    expect(output[0]).not.toHaveProperty("id");
  });

  it("projects only display fields from active add-on records", () => {
    const output = projectPublicServiceAddons([{
      id: "741609fc-acbd-4315-a6e4-d6e53049b7ec",
      name: "Hosting terkelola",
      description: "Paket dukungan tahunan.",
      price: 1_200_000,
      billingType: "yearly",
      isActive: true,
      sortOrder: 1,
    }]);

    expect(output).toEqual([{
      name: "Hosting terkelola",
      description: "Paket dukungan tahunan.",
      price: 1_200_000,
      billingType: "yearly",
    }]);
    expect(output[0]).not.toHaveProperty("id");
    expect(output[0]).not.toHaveProperty("isActive");
  });
});
