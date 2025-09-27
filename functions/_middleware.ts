import * as cookie from "cookie";
import * as z from "zod";

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const result = z
    .enum(["dark", "light"])
    .safeParse(
      cookie.parse(context.request.headers.get("cookie") ?? "")["theme"],
    );

  if (!result.success) {
    return context.next();
  }

  return new HTMLRewriter()
    .on("html", {
      element(element) {
        element.setAttribute("data-theme", result.data);
      },
    })
    .transform(await context.next());
};
