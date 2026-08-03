import { useEffect, useState } from "react";
import { useQuizStore } from "../store/selectedIng";
import { FormulaDownloadButton } from "../components/formulaButtton";
import { adaptRawFormulaResponse } from "../utils/Adaptrawformularesponse";

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

function IngredientsPage() {
  const [selectedNotes, setSelectedNotes] = useState<Notes[]>([]);
  const [allNotes, setAllNotes] = useState<Group[]>([]);
  const [formula, setFormula] = useState<any>();
  const [bottleSize, setBottleSize] = useState<number>(130);

  const handleCheckboxChange = (note: Notes, checked: boolean) => {
    setSelectedNotes((prev) => {
      if (checked) {
        return [...prev, note];
      }

      return prev.filter((n) => n.id !== note.id);
    });
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch(`${apiUrl}/api/notes/category`);
      const data = await res.json();
      setAllNotes(data.data);
    };

    fetchNotes();
  }, []);

  const handleSubmit = () => {
    const token = localStorage.getItem("token");
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
        console.log(result);
        const rev = await adaptRawFormulaResponse(result.data, selectedNotes, {
          bottleSizeMl: bottleSize,
        });
        console.log(rev);
        await setFormula(rev);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const quizResult = useQuizStore((state: any) => state?.quizResult);

  useEffect(() => {
    if (quizResult) setSelectedNotes(quizResult.notes);
  }, [quizResult]);

  return (
    <main className="max-w-6xl mx-auto py-30 px-10 space-y-5">
      <div className="space-y-1">
        <h3 className="text-3xl">
          Size : <span className="text-lg">{bottleSize.toString()}ml</span>
        </h3>
        <div className="flex items-center justify-start gap-2">
          {[20, 55, 130].map((n) => (
            <button
              onClick={() => {
                setBottleSize(n);
              }}
              key={n}
              className="btn dark"
            >
              {n}ml
            </button>
          ))}
        </div>
      </div>
      {allNotes.map((group: Group) => (
        <div key={group.family}>
          <h2 className="font-bold text-xl capitalize">{group.family}</h2>

          <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2">
            {group.notes.map((note) => (
              <label
                key={note.id}
                className="flex items-center gap-2 py-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedNotes.some((n) => n.id === note.id)}
                  onChange={(e) => handleCheckboxChange(note, e.target.checked)}
                />

                <span>{note.name}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      {formula ? (
        <>
          <FormulaDownloadButton formula={formula} />
        </>
      ) : (
        <>
          <button className="btn dark" onClick={handleSubmit}>
            {"Submit"}
          </button>
        </>
      )}
    </main>
  );
}

export default IngredientsPage;
