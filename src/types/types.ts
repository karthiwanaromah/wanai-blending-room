export type Notes = {
    id: string | number;
    percentage?: number;
    ml: number;
    drops: number;
    noteId: number;
    noteName: string;
    noteLayer: string;

};

export type Formula = {
    id: string | number;
    bottleSizeMl: number;
    totalConcentrateMl: number;
    engineSource?: string;
    reasoning?: string;
    createdAt: string;
    notes: Notes[];
    status?: "pending" | "approved" | "rejected";
};