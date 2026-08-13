import { useEffect, useMemo, useRef, useState } from "react";
import { useQuizStore } from "../store/selectedIng";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BASE_URL;

interface Group {
  family: string;
  notes: Notes[];
}

interface Notes {
  id: number;
  name: string;
  layer: string;
  family: string;
}

const BOTTLE_SIZES = [55, 100];

function IngredientsPage() {
  const [selectedNotes, setSelectedNotes] = useState<Notes[]>([]);
  const [allNotes, setAllNotes] = useState<Group[]>([]);
  const [bottleSize, setBottleSize] = useState<number>(100);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const navigation = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quizResult = useQuizStore((state: any) => state?.quizResult);

  // Flatten all notes once for search
  const flatNotes = useMemo(() => allNotes.flatMap((g) => g.notes), [allNotes]);

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return flatNotes
      .filter((n) => !selectedNotes.some((s) => s.id === n.id))
      .filter((n) => n.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, flatNotes, selectedNotes]);

  const addNote = (note: Notes) => {
    setSelectedNotes((prev) =>
      prev.some((n) => n.id === note.id) ? prev : [...prev, note],
    );
    setSearch("");
    setHighlightIndex(0);
    inputRef.current?.focus();
  };

  const removeNote = (id: number) => {
    setSelectedNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleNote = (note: Notes) => {
    setSelectedNotes((prev) =>
      prev.some((n) => n.id === note.id)
        ? prev.filter((n) => n.id !== note.id)
        : [...prev, note],
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredNotes.length === 0) {
      if (e.key === "Escape") setIsOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % filteredNotes.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(
        (i) => (i - 1 + filteredNotes.length) % filteredNotes.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const note = filteredNotes[highlightIndex];
      if (note) addNote(note);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setHighlightIndex(0);
  }, [search]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/notes/category`);
        const data = await res.json();
        setAllNotes(data.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    if (quizResult) setSelectedNotes(quizResult.notes);
  }, [quizResult]);

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
    setSubmitting(true);
    fetch(`${apiUrl}/api/formula`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bottleSizeMl: bottleSize,
        notes: selectedNotes,
      }),
    })
      .then(async (n: any) => {
        const result = await n.json();
        navigation(`/formula/${result.data.formulaId}`);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#171717]">
      {/* Header */}
      <header className="border-b border-black/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#77736d]">
                Wanaromah
              </p>

              <h1 className="mt-1 text-xl font-medium tracking-tight">
                Personal Fragrance
              </h1>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-xs text-[#8a867f]">Step 2 of 2</p>
              <div className="mt-2 h-1 w-24 overflow-hidden rounded-full bg-black/10">
                <div className="h-full w-full rounded-full bg-black" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-36 pt-12 sm:px-6 lg:pt-16">
        {/* Hero */}
        <section className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a6f4d]">
            Build your formula
          </p>

          <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-[#171717] sm:text-5xl lg:text-6xl">
            Create a scent
            <br />
            that feels like you.
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-[#66625c]">
            Choose the fragrance notes you love. We'll use your selections to
            create a personalized perfume formula.
          </p>
        </section>

        {/* Bottle size */}
        <section className="mt-14">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-[#171717]">
              Choose your bottle
            </h3>

            <p className="mt-1 text-sm text-[#77736d]">
              Select the size you'd like your formula prepared in.
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3">
            {BOTTLE_SIZES.map((size) => {
              const selected = bottleSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => setBottleSize(size)}
                  className={`relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                    selected
                      ? "border-[#171717] bg-[#171717] text-white shadow-lg shadow-black/10"
                      : "border-black/10 bg-white text-[#171717] hover:border-black/30 hover:shadow-md"
                  }`}
                >
                  {selected && (
                    <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-black">
                      ✓
                    </span>
                  )}

                  <span
                    className={`block text-2xl font-semibold ${
                      selected ? "text-white" : "text-[#171717]"
                    }`}
                  >
                    {size}ml
                  </span>

                  <span
                    className={`mt-1 block text-xs ${
                      selected ? "text-white/60" : "text-[#8a867f]"
                    }`}
                  >
                    {size === 20
                      ? "Travel size"
                      : size === 55
                        ? "Everyday"
                        : "Full size"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Notes section */}
        <section className="mt-16">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#171717]">
              Choose your notes
            </h3>

            <p className="mt-1 text-sm text-[#77736d]">
              Search for a note or explore our fragrance families.
            </p>
          </div>

          {/* Search */}
          <div ref={containerRef} className="relative max-w-2xl">
            <div
              className={`flex items-center rounded-2xl border bg-white transition-all ${
                isOpen
                  ? "border-[#171717] shadow-lg shadow-black/5"
                  : "border-black/10 hover:border-black/25"
              }`}
            >
              <svg
                className="ml-5 h-5 w-5 shrink-0 text-[#8a867f]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => {
                  if (search.trim()) setIsOpen(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search for sandalwood, vanilla, oud..."
                className="w-full bg-transparent px-4 py-4 text-sm text-[#171717] outline-none placeholder:text-[#aaa59d]"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setIsOpen(false);
                  }}
                  className="mr-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#f0eee9] text-xs text-[#555]"
                >
                  ×
                </button>
              )}
            </div>

            {/* Search dropdown */}
            {isOpen && search.trim() && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl shadow-black/10">
                {filteredNotes.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto p-2">
                    {filteredNotes.map((note, index) => (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => addNote(note)}
                        onMouseEnter={() => setHighlightIndex(index)}
                        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                          index === highlightIndex
                            ? "bg-[#f4f1eb]"
                            : "hover:bg-[#f8f7f4]"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-[#171717]">
                            {note.name}
                          </p>

                          <p className="mt-0.5 text-xs capitalize text-[#99948c]">
                            {note.layer} · {note.family}
                          </p>
                        </div>

                        <span className="text-xs text-[#99948c]">Add +</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center">
                    <p className="text-sm font-medium text-[#44413c]">
                      No notes found
                    </p>

                    <p className="mt-1 text-xs text-[#99948c]">
                      Try another fragrance note.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected notes */}
          {selectedNotes.length > 0 && (
            <div className="mt-5 max-w-4xl rounded-2xl border border-[#dfd5c5] bg-[#f5efe5] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#3b3328]">
                    Your selected notes
                  </p>

                  <p className="mt-0.5 text-xs text-[#8c7e6c]">
                    {selectedNotes.length}{" "}
                    {selectedNotes.length === 1 ? "note" : "notes"} selected
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedNotes.map((note) => (
                  <div
                    key={note.id}
                    className="group flex items-center gap-2 rounded-full border border-[#d8cbb8] bg-white px-3.5 py-2 text-sm text-[#29241e] shadow-sm"
                  >
                    <span>{note.name}</span>

                    <button
                      type="button"
                      onClick={() => removeNote(note.id)}
                      aria-label={`Remove ${note.name}`}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#eee8de] text-[#71695e] transition-colors hover:bg-[#171717] hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Browse */}
        <section className="mt-16">
          <div className="mb-7">
            <h3 className="text-lg font-semibold text-[#171717]">
              Explore by family
            </h3>

            <p className="mt-1 text-sm text-[#77736d]">
              Pick anything that catches your attention.
            </p>
          </div>

          <div className="space-y-5">
            {allNotes.map((group) => (
              <div
                key={group.family}
                className="rounded-3xl border border-black/10 bg-white p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-semibold capitalize text-[#171717]">
                      {group.family}
                    </h4>

                    <p className="mt-1 text-xs text-[#99948c]">
                      {group.notes.length} fragrance notes
                    </p>
                  </div>

                  <span className="hidden text-xs uppercase tracking-[0.18em] text-[#aaa59d] sm:block">
                    Fragrance family
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {group.notes.map((note) => {
                    const isSelected = selectedNotes.some(
                      (n) => n.id === note.id,
                    );

                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => toggleNote(note)}
                        className={`rounded-full border px-4 py-2.5 text-sm transition-all duration-200 ${
                          isSelected
                            ? "border-[#171717] bg-[#171717] font-medium text-white shadow-md"
                            : "border-[#dedbd5] bg-[#faf9f7] text-[#403d38] hover:border-[#99948c] hover:bg-white"
                        }`}
                      >
                        {isSelected && (
                          <span className="mr-1.5 text-xs">✓</span>
                        )}

                        {note.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-[#f7f5f0]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-5 py-4 sm:px-6">
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#171717]">
              {selectedNotes.length > 0
                ? `${selectedNotes.length} notes selected`
                : "No notes selected"}
            </p>

            <p className="mt-0.5 text-xs text-[#8a867f]">
              {bottleSize}ml personalized formula
            </p>
          </div>

          <button
            type="button"
            className="ml-auto flex min-w-55 items-center justify-center gap-3 rounded-full bg-[#171717] px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-black/15 transition-all hover:bg-[#292929] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={handleSubmit}
            disabled={submitting || selectedNotes.length === 0}
          >
            {submitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating formula...
              </>
            ) : (
              <>
                Create my formula
                <span className="text-lg">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IngredientsPage;
