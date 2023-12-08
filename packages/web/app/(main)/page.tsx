import MainFeed from "../components/MainFeed";
import LoadingLayer from "@/components/LoadingLayer";

export default async function Home() {
  return (
    <main className="flex flex-col">
      <MainFeed />
    </main>
  );
}
