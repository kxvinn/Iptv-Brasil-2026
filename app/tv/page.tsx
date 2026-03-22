import { Suspense } from "react";
import { getAllChannels, getGroups } from "@/lib/channelData";
import HomeClient from "./HomeClient";

export default function HomePage() {
  const channels = getAllChannels();
  const groups = getGroups();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex flex-col items-center justify-center">Carregando...</div>}>
      <HomeClient channels={channels} groups={groups} />
    </Suspense>
  );
}
