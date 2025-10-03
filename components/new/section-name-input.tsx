"use client";
import React, { useState } from "react";
import H1 from "../H1";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Button } from "../ui/button";

export default function SectionNameInput() {
    const { displayName, sections, addSections } = useScheduleStore();
    const [newSection, setNewSection] = useState("");

    const handleAdd = () => {
        if (newSection.trim() !== "") {
            addSections(newSection.trim());
            setNewSection(""); // clear input after adding
        }
    };

    return (
        <>
            {displayName && (
                <>
                    <H1>Add Sections</H1>
                    <input
                        className="border p-2 rounded mr-2"
                        type="text"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                        placeholder="Enter section name"
                    />
                    <Button onClick={handleAdd}>Add Section</Button>

                    {sections.length > 0 && <>
                        <ul className="list-disc ml-5">
                            {sections.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </>}
                </>
            )}
        </>
    );
}
