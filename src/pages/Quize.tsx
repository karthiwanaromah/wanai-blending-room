import React, { useState } from "react";
import { useQuizStore } from "../store/selectedIng";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/toast";

interface QuizOption {
  label: string;
  emoji: string;
  selected: boolean;
}

interface QuizQuestion {
  queno: string;
  que: string;
  options: QuizOption[];
}
const apiUrl = import.meta.env.VITE_BASE_URL;
const initialQuizSet: QuizQuestion[] = [
  {
    queno: "que_1",
    que: "What vibe do you want your perfume to give off?",
    options: [
      { label: "Fresh & Clean", emoji: "🌬️", selected: false },
      { label: "Warm & Cosy", emoji: "☕", selected: false },
      { label: "Romantic & Sensual", emoji: "🌹", selected: false },
      { label: "Bold & Confident", emoji: "🔥", selected: false },
      { label: "Playful & Sweet", emoji: "🍬", selected: false },
      { label: "Mysterious & Deep", emoji: "🌙", selected: false },
    ],
  },
  {
    queno: "que_2",
    que: "Pick the scent family that excites you most.",
    options: [
      { label: "Floral", emoji: "🌸", selected: false },
      { label: "Fruity", emoji: "🍑", selected: false },
      { label: "Woody & Earthy", emoji: "🌲", selected: false },
      { label: "Sweet & Gourmand", emoji: "🍮", selected: false },
      { label: "Spicy & Oriental", emoji: "🕌", selected: false },
      { label: "Tea & Herbal", emoji: "🍵", selected: false },
    ],
  },
  {
    queno: "que_3",
    que: "How long-lasting and strong do you want the scent?",
    options: [
      { label: "Very Light", emoji: "🪶", selected: false },
      { label: "Light & Fresh", emoji: "🌬️", selected: false },
      { label: "Moderate", emoji: "⚖️", selected: false },
      { label: "Strong", emoji: "💪", selected: false },
      { label: "Very Bold", emoji: "🔊", selected: false },
    ],
  },
  {
    queno: "que_4",
    que: "When do you picture yourself wearing this perfume?",
    options: [
      { label: "Everyday Wear", emoji: "👕", selected: false },
      { label: "Work & Office", emoji: "💼", selected: false },
      { label: "Date Nights", emoji: "🌹", selected: false },
      { label: "Events & Parties", emoji: "🎉", selected: false },
      { label: "Outdoor & Travel", emoji: "🌍", selected: false },
      { label: "Evenings & Formal", emoji: "🎩", selected: false },
    ],
  },
  {
    queno: "que_5",
    que: "Which texture or feeling best matches what you want?",
    options: [
      { label: "Powdery & Soft", emoji: "🧸", selected: false },
      { label: "Juicy & Bright", emoji: "🍋", selected: false },
      { label: "Creamy & Smooth", emoji: "🥛", selected: false },
      { label: "Smoky & Dark", emoji: "🖤", selected: false },
      { label: "Aquatic & Ozonic", emoji: "🌊", selected: false },
      { label: "Spiced & Warming", emoji: "🌶️", selected: false },
    ],
  },
];

const PerfumeQuiz: React.FC = () => {
  const [quizSet, setQuizSet] = useState<QuizQuestion[]>(initialQuizSet);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [toast, setToast] = useState<string>("");
  const toasts = useToast();

  const setQuizResult = useQuizStore((state: any) => state.setQuizResult);
  const navigate = useNavigate();
  const totalSteps = quizSet.length;
  const currentQuestion = quizSet[activeStep];
  const isAnswered = currentQuestion?.options.some((o) => o.selected);

  const handleNext = () =>
    setActiveStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const onInputChange = (queno: string, label: string) => {
    setQuizSet((prev) =>
      prev.map((card) => {
        if (card.queno !== queno) return card;
        return {
          ...card,
          options: card.options.map((opt) => ({
            ...opt,
            selected: opt.label === label,
          })),
        };
      }),
    );
  };

  const onSubmit = async () => {
    const notAttemptedCount = quizSet.filter(
      (item) => !item.options.some((opt) => opt.selected),
    ).length;

    if (notAttemptedCount > 0) {
      setToast("Please answer all questions before submitting");
      setTimeout(() => setToast(""), 4000);
      return;
    }

    const token = localStorage.getItem("token");

    console.log(token);

    if (!token) return;

    const payload = {
      vibe: quizSet
        .find((q) => q.queno === "que_1")
        ?.options.find((o) => o.selected)?.label,

      family: quizSet
        .find((q) => q.queno === "que_2")
        ?.options.find((o) => o.selected)?.label,

      intensity: quizSet
        .find((q) => q.queno === "que_3")
        ?.options.find((o) => o.selected)?.label,

      occasion: quizSet
        .find((q) => q.queno === "que_4")
        ?.options.find((o) => o.selected)?.label,

      texture: quizSet
        .find((q) => q.queno === "que_5")
        ?.options.find((o) => o.selected)?.label,
    };

    fetch(apiUrl + "/api/quiz", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (n: any) => {
        const result = await n.json();
        console.log(result);
        await setQuizResult(result?.data);
        navigate("/notes-selection");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className=" flex flex-col">
      {/* thin top progress line */}
      <div className="w-full h-px bg-[#E3D9C4]">
        <div
          className="h-px bg-[#C4963A] transition-all duration-300 ease-out"
          style={{ width: `${((activeStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl">
          {/* header row */}
          <div className="flex items-baseline justify-between mb-10">
            <span
              className="text-6xl text-[#E3D9C4] leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {String(activeStep + 1).padStart(2, "0")}
            </span>
            <span className="text-xs tracking-[0.2em] uppercase text-[#9A8C76]">
              {activeStep + 1} of {totalSteps}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl text-[#3B2A20] mb-10 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {currentQuestion.que}
          </h1>

          <div className="divide-y divide-[#E3D9C4]">
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => onInputChange(currentQuestion.queno, opt.label)}
                className="w-full flex items-center gap-4 py-4 text-left group"
              >
                <span
                  className={`w-1 self-stretch rounded-full transition-colors duration-200 ${
                    opt.selected ? "bg-[#C4963A]" : "bg-transparent"
                  }`}
                />
                <span>{idx + 1}.</span>

                <span
                  className={`flex-1 text-base transition-colors duration-200 ${
                    opt.selected
                      ? "text-[#3B2A20] font-medium"
                      : "text-[#7A6E5E] group-hover:text-[#3B2A20]"
                  }`}
                >
                  {opt.label}
                </span>
                <span
                  className={`text-sm transition-opacity duration-200 ${
                    opt.selected ? "opacity-100 text-[#C4963A]" : "opacity-0"
                  }`}
                >
                  ✓
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-12">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className="text-sm text-[#9A8C76] hover:text-[#3B2A20] transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              ← Back
            </button>

            {activeStep === totalSteps - 1 ? (
              <button
                onClick={onSubmit}
                className="text-sm tracking-wide text-[#FAF7F2] bg-[#3B2A20] px-8 py-3 rounded-full hover:bg-[#2A1D16] transition-colors"
              >
                See my profile
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className="text-sm tracking-wide text-[#FAF7F2] bg-[#3B2A20] px-8 py-3 rounded-full hover:bg-[#2A1D16] transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>

      {toast && toasts({ variant: "warning", message: toast })}
    </div>
  );
};

export default PerfumeQuiz;
