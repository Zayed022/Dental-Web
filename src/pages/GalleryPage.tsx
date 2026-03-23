import { useState } from "react";
import { Building2, Activity, Repeat, Users } from "lucide-react";
import { PublicLayout } from "@/components/PublicLayout";

const galleryData = {
  clinic: [
    "https://images.unsplash.com/photo-1588776814546-ec7e0b7a1c02",
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
  ],
  treatments: [
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09",
    "https://images.unsplash.com/photo-1588771930290-7e8d7c3f1b0a",
  ],
  beforeAfter: [
    "https://images.unsplash.com/photo-1609840114035-3c981b782dfe",
    "https://images.unsplash.com/photo-1598257006626-48b0c252070d",
  ],
  patients: [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
  ],
};

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("patients");

  const tabs = [
    { id: "clinic", label: "Our Clinic", icon: Building2 },
    { id: "treatments", label: "Treatments", icon: Activity },
    { id: "beforeAfter", label: "Before & After", icon: Repeat },
    { id: "patients", label: "Our Patients", icon: Users },
  ];

  return (

    <>
    <PublicLayout>
    <div className="bg-white">

      {/* HERO */}
      <section className="bg-primary text-white py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Explore Our Gallery
        </h1>
        <p className="max-w-2xl mx-auto text-white/90">
          Take a visual tour of our clinic, view our treatments, and see the
          transformative results we deliver
        </p>
      </section>

      {/* TABS */}
      <section className="py-10">
        <div className="container flex justify-center">
          <div className="bg-secondary/40 rounded-2xl p-3 flex gap-4 flex-wrap justify-center">

            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center px-6 py-4 rounded-xl transition ${
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-white"
                }`}
              >
                <tab.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}

          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="pb-16">
        <div className="container">

          {/* Dynamic Heading */}
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-primary">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "patients" &&
                "Meet some of our satisfied patients who trusted us with their dental care"}
              {activeTab === "clinic" &&
                "A glimpse into our modern and hygienic dental clinic"}
              {activeTab === "treatments" &&
                "Advanced dental treatments we offer"}
              {activeTab === "beforeAfter" &&
                "Real transformations from our dental procedures"}
            </p>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryData[activeTab].map((img, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition group"
              >
                <img
                  src={img}
                  alt="gallery"
                  className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
    </PublicLayout>
    </>
  );
}