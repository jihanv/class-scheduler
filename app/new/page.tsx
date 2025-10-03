import ClassNameInput from "@/components/new/class-name-input";
import SectionNameInput from "@/components/new/section-name-input";

export default function Home() {
    return (
        <main className="flex flex-col justify-center items-center gap-5">
            <ClassNameInput />
            <SectionNameInput />
        </main>
    );
}