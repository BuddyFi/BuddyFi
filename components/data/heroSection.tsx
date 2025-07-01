import { motion } from "framer-motion";
import Image from "next/image";

export default function IntroSection() {
  return (
    <>
      <div className="pt-30 pb-16 text-center">
      
        
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex md:flex-row flex-col gap-2 items-center justify-center"
          >
            <motion.div 
              className="flex -space-x-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 1 + (i * 0.1) }}
                  className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-slate-800"
                >
                  <Image
                    src={`/placeholder${i}.jpeg`}
                    alt={`User ${i}`}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              ))}
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
              className="ml-4 text-sm text-slate-400"
            >
              Trusted by{" "}
              <span className="font-semibold text-cyan-400">100+</span> active
              Solana developers this month — and growing.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
