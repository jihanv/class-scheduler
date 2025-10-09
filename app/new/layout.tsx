
import "@/app/globals.css";
import InformationDisplay from "@/components/new/information-display";


export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-row">

            <div className="flex-[1]">
                <InformationDisplay />

            </div>

            <div className="flex-[2]">
                {children}
            </div>



        </div >
    );
}
