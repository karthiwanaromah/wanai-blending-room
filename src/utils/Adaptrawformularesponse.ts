// apps/web/src/utils/adaptRawFormulaResponse.js
//
// Bridges the raw formulaEngine.generateFormula() output (noteId + numbers
// only, no names) into the shape FormulaPDF.jsx actually expects. This is a
// STOPGAP — the real fix is having the API return the joined/saved formula
// (via getFormulaById) so the frontend never has to do this stitching.
//
// @param {Object} rawResponse - { totalConcentrateMl, notes: [{noteId, layer, percentage, ml, drops}] }
// @param {Array} noteLibrary - full note list fetched from GET /api/notes, used to look up names
// @param {Object} meta - the metadata the raw response doesn't include: { id, bottleSizeMl, reasoning, createdAt }
type RawNote = {
    noteId: number | string;
    layer: any;
    percentage: number;
    ml: number;
    drops: number;
};

type RawResponse = {
    formula: { totalConcentrateMl: number };
    formulaNotes: RawNote[];
};

type NoteRecord = {
    id: number | string;
    name?: string;
    layer?: any;
};

type Meta = {
    id?: string;
    bottleSizeMl?: number | null;
    reasoning?: string | null;
    createdAt?: string;
};

type AdaptedFormula = {
    id: string;
    bottleSizeMl: number | null;
    totalConcentrateMl: number;
    reasoning: string | null;
    createdAt: string;
    formulaNotes: Array<{
        id: number;
        percentage: number;
        ml: number;
        drops: number;
        note: { name: string; layer: any };
    }>;
};

export function adaptRawFormulaResponse(rawResponse: RawResponse, noteLibrary: NoteRecord[], meta: Meta = {}): AdaptedFormula {
    const noteById = new Map(noteLibrary.map((n) => [n.id, n]));

    const formulaNotes = rawResponse.formulaNotes.map((n, index) => {
        const noteRecord = noteById.get(n.noteId);
        return {
            id: index, // no real formula_notes row id in this raw shape — index is fine for React's key prop
            percentage: n.percentage,
            ml: n.ml,
            drops: n.drops,
            note: {
                name: noteRecord?.name ?? `Unknown note (#${n.noteId})`,
                layer: n.layer,
            },
        };
    });

    return {
        id: meta.id ?? "draft",
        bottleSizeMl: meta.bottleSizeMl ?? null,
        totalConcentrateMl: rawResponse.formula.totalConcentrateMl,
        reasoning: meta.reasoning ?? null,
        createdAt: meta.createdAt ?? new Date().toISOString(),
        formulaNotes,
    };
}