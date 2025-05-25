import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CodeBlock } from "../code-block";
import Image from "next/image";

// How it works steps
const steps = [
  {
    number: "01",
    title: "Connect Wallet",
    description:
      "Link your wallet to create your BuddyFi profile. We'll analyze your on-chain activity to establish your developer identity.",
    image: "/connect_wallet.jpg",
    codeSnippet: `// Connect wallet
  const account = await buddyfi.connect();
  console.log("Connected:", account);`,
  },
  {
    number: "02",
    title: "Create Profile",
    description:
      "Add your skills, interests, and preferences. Link your GitHub, showcase past projects, and set your availability for upcoming hackathons.",
    image: "/create_profile.jpg",
    codeSnippet: `// Create profile
  await buddyfi.createProfile({
    name: "DevName",
    skills: ["react", "solidity"],
    github: "username",
    availability: ["weekends", "evenings"]
  });`,
  },
  {
    number: "03",
    title: "Swipe & Match",
    description:
      "Browse potential teammates, swipe right on those you'd like to work with, and start chatting when you match. Form your dream team and get hacking!",
    image: "/matched.webp",
    codeSnippet: `// Find and match with teammates
  const potentialTeammates = await buddyfi.browse();
  for (const dev of potentialTeammates) {
    if (dev.skills.includes("needed-skill")) {
      await buddyfi.swipeRight(dev.id);
    }
  }`,
  },
];

export default function Steps() {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const howItWorksInView = useInView(howItWorksRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <>
      {/* How It Works Section */}
      <section ref={howItWorksRef} className=" px-4 py-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              <CodeBlock text="Three simple steps" />
            </h2>
            <p className="mt-4 text-xl text-slate-300">
              From solo coder to dream team in minutes
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-500/30 to-violet-500/30 md:block"></div>

            <div className="grid gap-12">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="relative grid items-center gap-8 md:grid-cols-2"
                >
                  <div
                    className={`order-2 ${
                      i % 2 === 1 ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <div className="group relative md:h-[500px]  w-full mb-10 overflow-hidden rounded-lg border-8 border-slate-800 bg-slate-900 shadow-xl shadow-cyan-500/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-500/10">
                      <Image
                        src={step.image || "/placeholder.svg"}
                        alt={step.title}
                        width={400}
                        height={500}
                        className="w-full transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="w-full max-w-[80%] rounded-lg bg-slate-950/90 p-4">
                          <pre className="overflow-x-auto font-mono text-xs text-cyan-400">
                            <code>{step.codeSnippet}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`order-1 ${
                      i % 2 === 1 ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    <div className="relative">
                      <div className="absolute left-1/2 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-14 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white md:left-0 md:translate-x-0">
                        <span className="font-mono font-bold">
                          {step.number}
                        </span>
                      </div>
                      <h3 className="mb-4 font-mono text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-slate-300">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
