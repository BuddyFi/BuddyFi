import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CodeBlock } from "../code-block";
import { RoadmapTimeline } from "../roadmap-timeline";

export default function Roadmap() {
  const roadmapRef = useRef<HTMLDivElement>(null);
  const roadmapInView = useInView(roadmapRef, { once: true, amount: 0.2 });

  return (
    <>
      {/* Roadmap Timeline */}
      <section ref={roadmapRef} className="px-4 py-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={roadmapInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              The journey <CodeBlock text="ahead" highlight />
            </h2>
            <p className="mt-4 text-xl text-slate-300">
              Our vision for the future of BuddyFi
            </p>
          </motion.div>

          <RoadmapTimeline inView={roadmapInView} />
        </div>
      </section>
    </>
  );
}
