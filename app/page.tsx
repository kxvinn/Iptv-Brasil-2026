import { getAllChannels, getGroups } from "@/lib/channelData";
import HomeClient from "./HomeClient";

export default function HomePage() {
  const channels = getAllChannels();
  const groups = getGroups();

  return <HomeClient channels={channels} groups={groups} />;
}
