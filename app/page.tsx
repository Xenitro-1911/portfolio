import Deck from "@/components/Deck";
import RiftStage from "@/components/RiftStage";
import Lobby from "@/components/scenes/Lobby";
import Profile from "@/components/scenes/Profile";
import ShiftLog from "@/components/scenes/ShiftLog";
import Missions from "@/components/scenes/Missions";
import Loadout from "@/components/scenes/Loadout";
import Exit from "@/components/scenes/Exit";
import { channels } from "@/data/cv";

export default function Page() {
  return (
    <>
      <Deck />
      <RiftStage channels={channels} />
      <main>
        <Lobby />
        <Profile />
        <ShiftLog />
        <Missions />
        <Loadout />
        <Exit />
      </main>
    </>
  );
}
