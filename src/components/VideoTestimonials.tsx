import { useState } from "react";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import teti4 from "../assets/videos/testi4.mp4";
import teti5 from "../assets/videos/testi5.mp4";
import teti6 from "../assets/videos/testi6.mp4";

import thumb1 from "../assets/ahmed.png";
import thumb2 from "../assets/renew.png";
import thumb5 from "../assets/thumb5.jpeg";

interface VideoTestimonial {
  id: string;
  name: string;
  role: string;
  videoSrc: string;
  poster: string;
}

const videos: VideoTestimonial[] = [
  {
    id: "1",
    name: "",
    role: "Cosmetology Patient",
    videoSrc: teti4,
    poster: thumb1,
  },
  {
    id: "2",
    name: "",
    role: "Medical Patient",
    videoSrc: teti5,
    poster:thumb5,
  },
  {
    id: "3",
    name: "",
    role: "Laser Treatment Patient",
    videoSrc: teti6,
    poster: thumb5,
  },
];

export default function VideoTestimonials() {
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);

  return (
    <>
      {/* ================= SECTION ================= */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0b1324]">
              Patient{" "}
              <span className="bg-gradient-to-r from-[#0095ff] to-[#ff7197] bg-clip-text text-transparent">
                Video Testimonials
              </span>
            </h2>
            <p className="mt-2 text-gray-600">
              Real stories. Real experiences. Trusted care.
            </p>
          </motion.div>

          {/* VIDEO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                {/* THUMBNAIL */}
                <div className="relative">
                  <img
                    src={item.poster}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />

                  <button
                    onClick={() => setActiveVideo(item)}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition"
                  >
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 text-[#0095ff] ml-0.5" />
                    </div>
                  </button>
                </div>

                {/* INFO */}
                <div className="px-5 py-4">
                  <p className="font-semibold text-[#0b1324]">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= VIDEO MODAL ================= */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 20 }}
              className="
                relative bg-black rounded-2xl overflow-hidden
                w-full max-w-[360px] max-h-[80vh]
              "
            >
              {/* CLOSE BUTTON */}
              <button
                onClick={() => setActiveVideo(null)}
                className="
                  absolute top-3 right-3 z-10
                  bg-black/60 text-white p-2 rounded-full
                  hover:bg-black transition
                "
              >
                <X size={18} />
              </button>

              {/* 9:16 VIDEO */}
              <div className="aspect-[9/16] w-full h-full">
                <video
                  src={activeVideo.videoSrc}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
