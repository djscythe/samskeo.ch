document
  .getElementById("theme-selector")
  ?.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error("event is not an instance of HTMLInputElement");
    }

    switch (event.target.value) {
      case "dark":
      case "light":
        break;
      default:
        throw new Error("malformed theme");
    }

    cookieStore
      .set({
        name: "theme",
        value: event.target.value,
        expires:
          Date.now() +
          // 6 months in milliseconds
          1.5768e10,
      })
      .catch((reason: unknown) => {
        console.error("failed to set theme cookie:", reason);
      });
  });
