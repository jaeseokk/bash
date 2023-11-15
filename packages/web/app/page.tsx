import { Suspense } from "react";
import MyEvents from "./components/MyEvents";
import { getServerSession } from "@/server/auth";

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex flex-col items-center justify-between pt-10">
      <h1 className="text-2xl font-medium leading-none">Bash</h1>
      {session && (
        <div className="mt-10 w-full">
          <div className="w-full">
            <h2 className="mb-4 px-8 text-xl font-medium leading-none">
              내 이벤트
            </h2>
            <Suspense fallback={null}>
              <MyEvents />
            </Suspense>
          </div>
        </div>
      )}
    </main>
  );
}
