import InformationDisplay from "@/components/new/information-display";
import Calculator from "@/components/new/main-calculator";
import MeetingList from "@/components/new/meeting-list";

export default function Home() {
  return (
    <main className="flex flex-row w-full">
      <div className="flex-[0.75] sticky top-0 h-screen overflow-auto">
        <InformationDisplay />
      </div>
      <div className="flex-[2]">
        <Calculator />
      </div>
      <div className="flex-[0.75] sticky top-0 h-screen overflow-auto">
        <MeetingList />
      </div>
    </main>
  );
}