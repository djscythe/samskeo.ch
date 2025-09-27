export const onRequestGet: PagesFunction<Env> = async (context) => {
  const theme = context.request.headers
    .get("cookie")
    ?.match(/theme=(light|dark)/)?.[1];

  if (theme) {
    return new HTMLRewriter()
      .on("html", {
        element(element) {
          element.setAttribute("data-theme", theme);
        },
      })
      .transform(await context.next());
  }

  return context.next();
};
