import React, { useState } from 'react';
import { 
  Presentation, 
  Download, 
  Maximize2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Code2, 
  Database, 
  Workflow, 
  Layout, 
  X,
  ExternalLink
} from 'lucide-react';

const SLIDES = [
  {
    id: 'system_architecture',
    number: '01 / 06',
    title: 'System Architecture & Dataflow',
    filename: '/slides/system_architecture.jpg',
    icon: Layers,
    tag: 'Architectural Blueprint',
    description: 'Complete multi-tier flow from Citizen PWA, Node.js Express & Turf.js GIS pipeline, Python FastAPI YOLOv8 Vision microservice, to MongoDB Atlas 2dsphere indexing and OGD export.'
  },
  {
    id: 'use_case_diagram',
    number: '02 / 06',
    title: 'Platform Use Case Diagram',
    filename: '/slides/use_case_diagram.jpg',
    icon: Workflow,
    tag: 'Actor & Interaction Spec',
    description: 'Specification of all primary roles: Citizen User, GCC Municipal Authority/Supervisor, Field Sanitation Driver, and AI Microservice with bounding validations and emergency dispatch.'
  },
  {
    id: 'er_diagram',
    number: '03 / 06',
    title: 'Entity-Relationship (ER) Diagram',
    filename: '/slides/er_diagram.jpg',
    icon: Database,
    tag: 'Relational & Spatial Schema',
    description: 'Mongoose database entities: Tickets (2dsphere point coordinates, pHash index), Citizen Reporters, Field Workers, Resolution Proofs, LULC Zones, and Civic Emergency Alerts.'
  },
  {
    id: 'module_description',
    number: '04 / 06',
    title: 'Core Platform Modules',
    filename: '/slides/module_description.jpg',
    icon: Layout,
    tag: 'System Decomposition',
    description: 'Detailed modular breakdown of Module 1 (Citizen Geo-Reporting), Module 2 (Authority GIS Suite), Module 3 (AI Vision & Deduplication), and Module 4 (Field Worker Route Portal).'
  },
  {
    id: 'technology_stack',
    number: '05 / 06',
    title: 'Technology Stack Matrix',
    filename: '/slides/technology_stack.jpg',
    icon: Code2,
    tag: 'Stack Specification',
    description: 'Comprehensive overview of React 18, Tailwind CSS, Vite, Leaflet, Node.js, Express, Turf.js, Python 3, FastAPI, YOLOv8, ImageHash, and MongoDB Atlas.'
  },
  {
    id: 'ui_design',
    number: '06 / 06',
    title: 'UI & Experience Design System',
    filename: '/slides/ui_design.jpg',
    icon: Sparkles,
    tag: 'Terrava Glassmorphism & Tokens',
    description: 'Showcase of Terrava mobile & desktop interfaces, exact color palette swatches (#243C2C, #7A9445, #DFF478, #59789F, etc.), and modular retro-modern display typography.'
  }
];

export default function PresentationGallery({ easyRead }) {
  const [activeModalSlide, setActiveModalSlide] = useState(null);

  const handleDownloadSlide = (filename, title) => {
    const link = document.createElement('a');
    link.href = filename;
    link.download = `CleanChennai_${title.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    link.click();
  };

  return (
    <div className={`space-y-6 max-w-6xl mx-auto ${easyRead ? 'easy-read' : ''}`}>
      
      {/* Top Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#243C2C] text-[#DFF478] text-xs font-bold uppercase tracking-wider mb-2">
            <Presentation size={12} />
            PowerPoint (PPT) Slide Assets
          </div>
          <h1 className="font-retro-title text-2xl sm:text-3xl text-[#243C2C]">
            Presentation Diagrams & Visual Specifications
          </h1>
          <p className="text-xs sm:text-sm text-[#243C2C]/80 mt-0.5 max-w-2xl">
            6 high-definition, neat, 16:9 presentation slide graphics generated specifically for your CleanChennai presentation deck.
          </p>
        </div>

        <div className="bg-white/80 p-3 rounded-2xl border border-white text-xs">
          <span className="text-[10px] uppercase font-bold text-[#59789F]">Format</span>
          <div className="font-bold text-[#243C2C]">16:9 HD Slide Aspect Ratio</div>
          <span className="text-[11px] text-[#7A9445] font-semibold">PPT Ready • Individual Slides</span>
        </div>
      </div>

      {/* 6 Slides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SLIDES.map((slide) => {
          const Icon = slide.icon;
          return (
            <div
              key={slide.id}
              className="glass-panel rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 hover:shadow-xl transition-all group border border-white/80"
            >
              <div>
                {/* Image Thumbnail with Overlay Preview */}
                <div 
                  onClick={() => setActiveModalSlide(slide)}
                  className="relative rounded-2xl overflow-hidden border border-[#A9B6C4]/40 aspect-video bg-black/5 cursor-pointer group-hover:scale-[1.01] transition-transform"
                >
                  <img
                    src={slide.filename}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="p-2 rounded-full bg-white/90 text-[#243C2C] shadow-md font-bold text-xs flex items-center gap-1.5">
                      <Maximize2 size={14} /> Fullscreen
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#243C2C]/80 backdrop-blur-md text-[#DFF478] font-bold text-[10px]">
                    {slide.number}
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#7A9445] font-bold">
                    <Icon size={14} />
                    <span>{slide.tag}</span>
                  </div>
                  <h3 className="font-bold text-base text-[#243C2C]">{slide.title}</h3>
                  <p className="text-xs text-[#243C2C]/75 leading-relaxed mt-1">
                    {slide.description}
                  </p>
                </div>
              </div>

              {/* Download & Fullscreen Actions */}
              <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalSlide(slide)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#F7F3E6] border border-[#A9B6C4]/30 text-xs font-bold text-[#243C2C] flex items-center gap-1.5 transition-all"
                >
                  <Maximize2 size={13} className="text-[#59789F]" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadSlide(slide.filename, slide.title)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#243C2C] hover:bg-[#17243F] text-[#DFF478] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download size={13} />
                  <span>Download for PPT</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeModalSlide && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-5xl w-full bg-[#F7F3E6] rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl border border-white/40 overflow-hidden">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A9445]">
                  {activeModalSlide.number} • {activeModalSlide.tag}
                </span>
                <h2 className="font-retro-title text-xl sm:text-2xl text-[#243C2C]">
                  {activeModalSlide.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSlide(activeModalSlide.filename, activeModalSlide.title)}
                  className="px-3.5 py-2 rounded-2xl bg-[#243C2C] text-[#DFF478] text-xs font-bold flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Download Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalSlide(null)}
                  className="p-2 rounded-full bg-white hover:bg-gray-100 text-[#243C2C] font-bold shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-black/10 bg-black/5 shadow-inner">
              <img
                src={activeModalSlide.filename}
                alt={activeModalSlide.title}
                className="w-full h-auto max-h-[75vh] object-contain mx-auto"
              />
            </div>

            <p className="text-xs text-[#243C2C]/80 text-center">
              {activeModalSlide.description}
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
