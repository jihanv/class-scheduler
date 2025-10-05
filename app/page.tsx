import InformationDisplay from "@/components/new/information-display";
import Calculator from "@/components/new/main-calculator";

export default function Home() {
  return (
    <main className="flex flex-row w-full">
      <div className="flex-[1]">
        <InformationDisplay />
      </div>
      <div className="flex-[2]">
        <Calculator />
      </div>
    </main>
  );
}