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
    const [feedback, setFeedback] = useState<string | null>(null);


    const handleAdd = () => {
        const raw = newSection.trim();
        if (!raw) return;

        const parts = raw
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

        const unique = Array.from(new Set(parts));

        // call the store for each section and collect results
        const results = unique.map((name) => ({
            name,
            ok: addSections(name),
        }));

        const added = results.filter((r) => r.ok).map((r) => r.name);
        const skipped = results.filter((r) => !r.ok).map((r) => r.name);

        if (added.length && !skipped.length) {
            setFeedback(
                `Added ${added.length} section${added.length > 1 ? "s" : ""}: ${added.join(", ")}`
            );
        } else if (added.length && skipped.length) {
            setFeedback(
                `Added ${added.length}: ${added.join(", ")} · Skipped ${skipped.length} (duplicates or limit): ${skipped.join(", ")}`
            );
        } else if (!added.length && skipped.length) {
            setFeedback(
                `No new sections added. Skipped ${skipped.length} (duplicates or limit): ${skipped.join(", ")}`
            );
        } else {
            setFeedback(null);
        }

        setNewSection("");
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();             // prevent full page reload
        if (newSection.trim() === "") return;
        handleAdd();
    };
    return (
        <>
            {displayName && (
                <>
                    <H1>Write the Sections for <span className="text-blue-500 ">{displayName}</span></H1>
                    <form onSubmit={handleSubmit} className="space-y-2">
                        <Input
                            type="text"
                            className="w-full"
                            value={newSection}
                            onChange={(e) => setNewSection(e.target.value)}
                            placeholder="e.g. 6-1 or 6-1, 6-2"
                        />

                        <p className="text-xs text-muted-foreground">
                            Tip: separate multiple sections with commas. We’ll trim spaces and ignore duplicates.
                        </p>

                        <Button type="submit" disabled={!newSection.trim()}>
                            Add a Section
                        </Button>

                        {feedback && (
                            <div className="mt-2 text-sm text-muted-foreground" aria-live="polite">
                                {feedback}
                            </div>
                        )}
                    </form>

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
