export async function POST(request: Request) {
  const { phoneNumber, code } = await request.json();

  if (!phoneNumber || !code) {
    return new Response("Invalid request", { status: 400 });
  }
}
