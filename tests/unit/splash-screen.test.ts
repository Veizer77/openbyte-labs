import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SplashScreen } from "@/components/public/SplashScreen";

describe("SplashScreen", () => {
  it("merender markup awal splash screen dengan logo OpenByte Labs", () => {
    const html = renderToStaticMarkup(createElement(SplashScreen));

    expect(html).toContain('id="splash-screen"');
    expect(html).toContain("/images/openbyte_labs_logo.svg");
    expect(html).toContain("Memuat OpenByte Labs");
    expect(html).toContain("bg-white");
  });
});
