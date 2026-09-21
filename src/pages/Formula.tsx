import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../services/socket.tsx";
import { FormulaDownloadButton } from "../components/formulaButtton.tsx";
import type { Formula } from "../types/types.ts";
import Instagram from "../assets/insta.png";
import Facebook from "../assets/facebook.png";
import Youtube from "../assets/youtube.png";
import Linkedin from "../assets/linkedin.png";

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/wanaromah",
  },
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/wanaromah",
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@wanaromah",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com/company/wanaromah",
  },
];

function FormulaPage() {
  const { id } = useParams();
  const [formula, setFormula] = useState<Formula | null>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Decrypt URL ID
  const formulaId = id ? id : null;

  // --------------------------------------------------
  // Fetch formula
  // --------------------------------------------------

  const fetchFormula = async () => {
    if (!formulaId) {
      setError("Invalid formula URL");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/formula/${formulaId}/one`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch formula");
      }

      const result = await response.json();

      if (result.success) {
        setFormula(result.data);
      } else {
        setError(result.message || "Failed to load formula");
      }
    } catch (error) {
      console.error("Failed to fetch formula:", error);
      setError("Failed to load your formula");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFormula();
  }, [formulaId]);

  // --------------------------------------------------
  // Socket.IO
  // --------------------------------------------------

  useEffect(() => {
    if (!formulaId) return;

    const handleFormulaApproved = (data: { formula: Formula }) => {
      console.log("Formula approved event:", data);

      // Make sure this event belongs to THIS formula
      if (Number(data.formula.id) !== Number(formulaId)) {
        return;
      }

      // Update immediately
      setFormula(data.formula);

      // Complete progress
      setProgress(100);
    };

    socket.on("formula:approved", handleFormulaApproved);

    return () => {
      socket.off("formula:approved", handleFormulaApproved);
    };
  }, [formulaId]);

  // --------------------------------------------------
  // Progress animation
  // --------------------------------------------------

  useEffect(() => {
    // Don't run progress if formula is already approved
    if (formula?.status === "approved") {
      setProgress(100);
      return;
    }

    if (formula?.status !== "pending") {
      return;
    }

    const duration = 10000;
    const interval = 50;

    const increment = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        // Don't reach 100 while waiting for approval
        const next = Math.min(prev + increment, 95);

        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [formula?.status]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your formula...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !formula) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || "Formula not found"}</p>
      </div>
    );
  }

  // --------------------------------------------------
  // APPROVED
  // --------------------------------------------------

  if (formula.status === "approved") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl w-full text-center">
          <div className="text-5xl mb-6">✨</div>

          <h1 className="text-3xl font-bold">
            Your Signature Formula Is Ready
          </h1>

          <p className="text-gray-500 mt-3">
            Your personalized fragrance formula has been carefully created and
            approved.
          </p>

          <div className="mt-8">
            <FormulaDownloadButton formula={formula} />
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // REJECTED
  // --------------------------------------------------

  if (formula.status === "rejected") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-xl text-center">
          <h1 className="text-3xl font-bold">Formula Needs Revision</h1>

          <p className="text-gray-500 mt-3">
            Your formula is currently being revised. Please check again shortly.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PENDING
  // --------------------------------------------------

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center">
          Creating Your Signature Formula
        </h1>

        <p className="text-center text-gray-500 mt-3">
          Our perfumers are carefully crafting a fragrance based on your
          personality and preferences.
        </p>

        {/* Progress */}
        <div className="mt-10">
          <div className="flex justify-between text-sm mb-2">
            <span>Preparing Formula...</span>

            <span>{Math.round(progress)}%</span>
          </div>

          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-75"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        <p className="text-center text-gray-500 mt-6">
          While we prepare your personalized fragrance, stay connected with us
          for exclusive launches, perfume tips, behind-the-scenes stories, and
          special offers.
        </p>

        {/* Social Links */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-xl p-4 hover:bg-gray-100 transition flex items-center gap-3"
            >
              <span className="text-2xl">
                <img src={social.icon} alt={social.name} className="w-6 h-6" />
              </span>

              <div>
                <p className="font-semibold">{social.name}</p>

                <p className="text-sm text-gray-500">Follow us</p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Your formula is being reviewed...
        </p>
      </div>
    </div>
  );
}

export default FormulaPage;
