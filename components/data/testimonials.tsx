import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CodeBlock } from "../code-block";
import { TestimonialCarousel } from "../testimonial-carousel";

// Testimonials data
const testimonials = [
  {
    name: "Pegasus'X",
    role: "On-Chain SPEAKER",
    image: "/placeholder.svg?height=100&width=100&text=AC",
    quote:
      "Omg damn.. This is gonna be explosive 🔥🔥 Super Bullish on this King",
  },
  {
    name: "Sahil Meena",
    role: "Blockchain Dev",
    image: "/placeholder.svg?height=100&width=100&text=SW",
    quote:
      "Guys if you're still looking out for a team for the Breakout Hackathon or just any other hackathon. THIS IS YOUR GO TO PLACE!!!",
  },
  {
    name: "Marcus Johnson",
    role: "Smart Contract Auditor",
    image: "/placeholder.svg?height=100&width=100&text=MJ",
    quote:
      "Found a team that perfectly complemented my security expertise with UI/UX talent. We've now worked on three hackathons together and launched a startup.",
  },
  {
    name: "Priya Sharma",
    role: "Full Stack Developer",
    image: "/placeholder.svg?height=100&width=100&text=PS",
    quote:
      "As someone who's always struggled to find the right teammates, BuddyFi has been revolutionary. The skill-matching algorithm is surprisingly accurate!",
  },
  {
    name: "David Kim",
    role: "Blockchain Architect",
    image: "/placeholder.svg?height=100&width=100&text=DK",
    quote:
      "The on-chain verification of skills is brilliant. No more exaggerated resumes or misleading profiles. What you see is what you get.",
  },
];

export default function Testimonials() {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const testimonialsInView = useInView(testimonialsRef, {
    once: true,
    amount: 0.2,
  });

  return (
    <>
      {/* Testimonials Carousel */}
      <section ref={testimonialsRef} className="px-4 py-24 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              <CodeBlock text="Success stories" />
            </h2>
            <p className="mt-4 text-xl text-slate-300">
              Hear from developers who found their dream teams
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={testimonialsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <TestimonialCarousel testimonials={testimonials} />
          </motion.div>
        </div>
      </section>
    </>
  );
}
