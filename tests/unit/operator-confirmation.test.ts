import { describe, expect, it } from "vitest";
import { hasOperatorConfirmation } from "../../scripts/lib/operator-confirmation";

describe("konfirmasi eksplisit perintah operator tanpa TTY", () => {
  it("mensyaratkan nama database tepat dan kata kunci operasi", () => {
    expect(
      hasOperatorConfirmation(
        ["--confirm-target=openbyte_labs", "--confirm-keyword=MIGRATE"],
        "openbyte_labs",
        "MIGRATE",
      ),
    ).toBe(true);
    expect(
      hasOperatorConfirmation(
        ["--confirm-target=openbyte_labs", "--confirm-keyword=SEED"],
        "openbyte_labs",
        "MIGRATE",
      ),
    ).toBe(false);
    expect(
      hasOperatorConfirmation(
        ["--confirm-target=openbyte_labs_test", "--confirm-keyword=MIGRATE"],
        "openbyte_labs",
        "MIGRATE",
      ),
    ).toBe(false);
  });

  it("tetap membutuhkan konfirmasi nama untuk pemeriksaan tanpa kata kunci", () => {
    expect(
      hasOperatorConfirmation(["--confirm-target=openbyte_labs"], "openbyte_labs"),
    ).toBe(true);
    expect(hasOperatorConfirmation([], "openbyte_labs")).toBe(false);
  });
});
