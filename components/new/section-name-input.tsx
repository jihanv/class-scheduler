"use client";
import React, { useEffect, useState } from "react";
import H1 from "./H1";
import { useScheduleStore } from "@/stores/scheduleStore";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { BADGE_COLORS } from "@/lib/constants";

export default function SectionNameInput() {
    const { displayName, sections, addSections, removeSection, uiLanguage } =
        useScheduleStore();
    const [newSection, setNewSection] = useState("");
    const [feedback, setFeedback] = useState<string | null>(null);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        if (!feedback) return;

        // show immediately
        setFading(false);

        // start fading near the end (adjust 2400 → taste)
        const fadeTimer = setTimeout(() => setFading(true), 2400);

        // fully clear after 3s total
        const clearTimer = setTimeout(() => {
            setFeedback(null);
            setFading(false); // reset for next time
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(clearTimer);
        };
    }, [feedback]);

    const handleAdd = () => {
        const raw = newSection.trim();
        if (!raw) return;

        const parts = raw
            .split(/[,、]/)
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
                `Added ${added.length} section${added.length > 1 ? "s" : ""
                }: ${added.join(", ")}`
            );
        } else if (added.length && skipped.length) {
            setFeedback(
                `Added ${added.length}: ${added.join(", ")} · Skipped ${skipped.length
                } (duplicates or limit): ${skipped.join(", ")}`
            );
        } else if (!added.length && skipped.length) {
            setFeedback(
                `No new sections added. Skipped ${skipped.length
                } (duplicates or limit): ${skipped.join(", ")}`
            );
        } else {
            setFeedback(null);
        }

        setNewSection("");
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevent full page reload
        if (newSection.trim() === "") return;
        handleAdd();
    };
    return (
        <>
            {" "}
            {/* {displayName && ( */}
            <>
                <H1>
                    {uiLanguage === "japanese"
                        ? `担当しているクラスをすべて書いてください`
                        : `Write Your Classes`}
                </H1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input
                        type="text"
                        className="w-full"
                        value={newSection}
                        onChange={(e) => setNewSection(e.target.value)}
                        placeholder={
                            uiLanguage === "japanese" ? `例： 数学IIB５ー３組` : `e.g. English 6-1`
                        }
                    />

                    <p className="text-xs text-muted-foreground whitespace-pre-line">
                        {uiLanguage === "japanese"
                            ? `1つずつ、または複数をカンマで区切って入力してください。
                例：
                ・1つずつ入力する場合：「数学IIB５ー３組」
                ・複数入力する場合：「英表III６ー１組、英表II５ー３組」

                ※「組を追加」ボタンを押したあとでも、必要に応じてクラスを追加・修正できます。`
                            : `Tip: separate multiple sections with commas.`}
                    </p>
                </form>

                {/* Badges area */}
                <div className="mt-2 min-h-10 max-h-30 overflow-auto">
                    <div className="flex flex-wrap gap-2">
                        {sections.map((s, i) => (
                            <span
                                key={s}
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${BADGE_COLORS[i % BADGE_COLORS.length]
                                    }`}
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
                        <div
                            className={`mt-2 text-sm text-muted-foreground transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"
                                } motion-reduce:transition-none motion-reduce:duration-0`}
                            aria-live="polite"
                        >
                            {feedback ?? ""}
                        </div>
                    </div>
                </div>
            </>
            {/* )} */}
            <Button
                type="submit"
                disabled={
                    sections.length === 0 && !newSection.trim() && !displayName?.trim()
                }
                onClick={handleAdd}
            >
                {uiLanguage === "japanese" ? `組を追加` : `Add Sections`}
            </Button>
        </>
    );
}
