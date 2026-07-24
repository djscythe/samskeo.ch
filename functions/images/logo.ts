import { Temporal } from "@js-temporal/polyfill";

export const onRequestGet: PagesFunction<Env> = (context) => {
  const now = Temporal.Now.zonedDateTimeISO(context.request.cf?.timezone);

  return Response.redirect(
    new URL(
      Math.random() <
        // --08-08 is International Cat Day; increase the chance of getting the
        // cat logo from 10% to 90%
        (now.month === 8 && now.day === 8 ? 0.9 : 0.1)
        ? "/images/logo-cat.min.svg"
        : "/images/logo.min.svg",
      context.request.url,
    ),
  );
};
