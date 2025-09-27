import assert from "./assert";

type Theme = "dark" | "light";

export default function themeSelector(): void {
  document
    .getElementById("theme-selector")
    ?.addEventListener("change", (event) => {
      const target = event.target;

      assert(
        target instanceof HTMLInputElement,
        "target is not an instance of HTMLInputElement",
      );

      const value = target.value;

      assert(
        value === "dark" || value === "light",
        "value is not a valid theme",
      );

      setThemeCookie(value).catch((reason: unknown) => {
        console.error("failed to set theme cookie:", reason);
      });
    });
}

async function setThemeCookie(theme: Theme): Promise<void> {
  await cookieStore.set({
    name: "theme",
    value: theme,
    expires: new Date().setMonth(new Date().getMonth() + 6),
  });
}
