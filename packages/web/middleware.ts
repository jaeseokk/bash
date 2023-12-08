import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(request) {
    if (!request.nextauth.token) {
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
