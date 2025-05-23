import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CodeBlock } from "../code-block";

// Problem cards data
const problemCards = [
  {
    title: "Last-minute scrambling",
    description:
      "Frantically DMing strangers on Discord the night before submissions open.",
    icon: "🏃‍♂️",
  },
  {
    title: "Skill mismatches",
    description: "I thought you knew Solidity? | I thought YOU knew Solidity!",
    icon: "🤔",
  },
  {
    title: "Trust issues",
    description:
      'Can you really trust someone who claims to be a "10x dev" with a Metamask PFP?',
    icon: "🔍",
  },
  {
    title: "Weekend warriors",
    description: "I'm free for 2 hours Sunday night — unless my cat gets sick.",
    icon: "📅",
  },
  {
    title: "Hero syndrome",
    description:
      "One teammate tries to solo the project while everyone else turns into spectators.",
    icon: "🦸‍♂️",
  },
  {
    title: "Timezone black hole",
    description:
      "When your standup turns into a ghost town because it's 4AM for half the team.",
    icon: "🕳️",
  },
];

export default function ProblemCards() {
  const problemRef = useRef<HTMLDivElement>(null);
  const problemInView = useInView(problemRef, { once: true, amount: 0.2 });

  return (
    <>
      {/* Problem Section */}
      <section ref={problemRef} className="px-4 py-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={problemInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              The <CodeBlock text="hackathon" highlight /> dilemma
            </h2>
            <p className="mt-4 text-xl text-slate-300">
              We&apos;ve all been there. The excitement of a new hackathon,
              followed by...
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {problemCards.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={problemInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group rounded-lg border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-cyan-500/10"
              >
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="mb-2 font-mono text-xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
