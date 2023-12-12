import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  async function middleware(request) {
    if (!request.nextauth.token) {
      // const res = await fetch("https://officiallets.webflow.io");
      // const html = await res.text();
      //
      // return new Response(
      //   html.replace(
      //     /<\/body>/,
      //     `<style>.w-webflow-badge {display: none !important;}</style></body>`,
      //   ),
      //   {
      //     status: 200,
      //     headers: { "content-type": "text/html" },
      //   },
      // );
      return NextResponse.rewrite(
        new URL("/", "https://officiallets.webflow.io"),
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized() {
        return true;
      },
    },
  },
);

export const config = {
  matcher: "/",
};
