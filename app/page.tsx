import InformationDisplay from "@/components/new/information-display";
import Calculator from "@/components/new/main-calculator";

export default function Home() {
  return (
    <main className="flex flex-row w-full">
      <div className="flex-[1] sticky top-0 h-screen overflow-auto">
        <InformationDisplay />
      </div>
      <div className="flex-[3]">
        <Calculator />
      </div>
    </main>
  );
}