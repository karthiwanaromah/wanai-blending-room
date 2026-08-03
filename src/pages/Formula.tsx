import { useEffect, useState } from "react";

interface FormulaPageProps {
  duration?: number; // milliseconds
  onComplete?: () => void;
}

const socialLinks = [
  {
    name: "Instagram",
    icon: "📸",
    url: "https://instagram.com/yourpage",
  },
  {
    name: "Facebook",
    icon: "📘",
    url: "https://facebook.com/yourpage",
  },
  {
    name: "YouTube",
    icon: "▶️",
    url: "https://youtube.com/@yourpage",
  },
  {
    name: "LinkedIn",
    icon: "💼",
    url: "https://linkedin.com/company/yourpage",
  },
];

function FormulaPage({
  duration = 10000, // Default 10 sec
  onComplete,
}: FormulaPageProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = 50;
    const increment = (100 * interval) / duration;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(prev + increment, 100);

        if (next >= 100) {
          clearInterval(timer);
          onComplete?.();
        }

        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [duration, onComplete]);

  return (
    <div className="min-h-screen  flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
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
              style={{ width: `${progress}%` }}
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
              <span className="text-2xl">{social.icon}</span>

              <div>
                <p className="font-semibold">{social.name}</p>
                <p className="text-sm text-gray-500">Follow us</p>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          This usually takes a few seconds...
        </p>
      </div>
    </div>
  );
}

export default FormulaPage;
