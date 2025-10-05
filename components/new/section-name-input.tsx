"use client";
import React, { useState } from "react";
import H1 from "../H1";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { BADGE_COLORS } from "@/lib/constants";

export default function SectionNameInput() {
    const { displayName, sections, addSections, removeSection, setShowDateSelector } = useScheduleStore();
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
                    <H1>Write the Sections for <span className="text-blue-500 ">{displayName}</span></H1>
                    <Input
                        type="text"
                        className='w-full'
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                        placeholder="e.g. 6-1"
                    />
                    <Button onClick={handleAdd}>Add a Section</Button>

                    {sections.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {sections.map((s, i) => (
                                <span
                                    key={s}
                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${BADGE_COLORS[i % BADGE_COLORS.length]}`}
                                >
                                    {s}
                                    <button
                                        onClick={() => removeSection(s)}
                                        className="hover:text-red-600 focus:outline-none"
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {sections.length > 0 && <Button onClick={() => setShowDateSelector()}>Select Dates</Button>}
                </>
            )}
        </>
    );
}
