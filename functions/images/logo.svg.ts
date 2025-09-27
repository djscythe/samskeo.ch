export const onRequestGet: PagesFunction<Env> = async (context) => {
  const response =
    Math.random() >= 0.9
      ? await context.env.ASSETS.fetch(
          new URL("images/logo-cat.svg", new URL(context.request.url).origin),
        )
      : await context.next();

  const newResponse = new Response(response.body, response);

  newResponse.headers.append("Cache-Control", "no-store");

  return newResponse;
};
