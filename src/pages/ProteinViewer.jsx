import React, { useState, useEffect, useRef } from 'react';
import * as NGL from 'ngl';
import {
  Play, Square, RotateCcw, ZoomIn, ZoomOut, Loader2,
  Atom, Eye, Layers
} from 'lucide-react';

function ProteinViewer() {
  const viewerRef = useRef(null);
  const stageRef = useRef(null);
  const [proteinComponent, setProteinComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('cartoon');
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!stageRef.current) {
      stageRef.current = new NGL.Stage(viewerRef.current, { backgroundColor: 'white' });
    }

    const stage = stageRef.current;
    stage.loadFile('/data/1a3n.pdb')
      .then(component => {
        if (isMounted) {
          component.addRepresentation('cartoon', { color: 'sstruc' });
          component.autoView();
          setProteinComponent(component);
          setIsLoading(false);
        }
      })
      .catch(error => {
        if (isMounted) {
          console.error("PDB loading failed:", error);
          setIsLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  const handleRepresentationChange = (repType) => {
    if (proteinComponent) {
      proteinComponent.removeAllRepresentations();
      proteinComponent.addRepresentation(repType, { color: 'sstruc' });
      setCurrentView(repType);
    }
  };

  const toggleSpin = () => {
    if (stageRef.current) {
      stageRef.current.setSpin(!isSpinning);
      setIsSpinning(!isSpinning);
    }
  };

  const resetView = () => {
    if (proteinComponent) proteinComponent.autoView();
  };

  const handleZoom = (factor) => {
    if (stageRef.current) {
      const viewer = stageRef.current.viewer;
      viewer.camera.zoom *= factor;
      viewer.requestRender();
    }
  };

  const viewOptions = [
    { key: 'cartoon', label: 'Cartoon', icon: Layers, description: 'Secondary structure view' },
    { key: 'ball+stick', label: 'Ball & Stick', icon: Atom, description: 'Atomic level detail' },
    { key: 'surface', label: 'Surface', icon: Eye, description: 'Molecular surface view' },
    { key: 'ribbon', label: 'Ribbon', icon: Layers, description: 'Ribbon backbone view' }
  ];

  return (
    <div className="min-h-screen p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex items-center space-x-6">
          <div className="p-4 rounded-xl shadow-lg">
            <Atom size={36} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold">Protein Viewer</h1>
            <p className="text-lg">Explore 3D molecular structures interactively</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-4 space-y-8">
            <div className=" rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Views</h2>
              <div className="space-y-3">
                {viewOptions.map(option => (
                  <button
                    key={option.key}
                    onClick={() => handleRepresentationChange(option.key)}
                    disabled={isLoading}
                    className={`w-full p-3 rounded-xl transition transform hover:scale-105 flex items-center justify-between ${
                      currentView === option.key
                        ? `shadow-lg`
                        : 'border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <option.icon size={24} />
                      <div className="text-left">
                        <div className="text-lg font-medium">{option.label}</div>
                        <div className="text-sm mt-1">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className=" rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4">Controls</h2>
              <div className="grid grid-cols-2 gap-6">
                <button
                  onClick={toggleSpin}
                  disabled={isLoading}
                  className={`p-4 rounded-xl flex flex-col items-center space-y-2  transform hover:scale-105 ${
                    isSpinning
                      ? ''
                      : ''
                  }`}
                >
                  {isSpinning ? <Square size={20} /> : <Play size={20} />}
                  <span>{isSpinning ? 'Stop' : 'Spin'}</span>
                </button>

                <button
                  onClick={resetView}
                  disabled={isLoading}
                  className="p-4 rounded-xl  flex flex-col items-center space-y-2 hover:scale-105 transform"
                >
                  <RotateCcw size={20} />
                  <span>Reset</span>
                </button>

                <button
                  onClick={() => handleZoom(1.2)}
                  disabled={isLoading}
                  className="p-4 rounded-xl flex flex-col items-center space-y-2 hover:scale-105 transform"
                >
                  <ZoomIn size={20} />
                  <span>Zoom In</span>
                </button>

                <button
                  onClick={() => handleZoom(0.8)}
                  disabled={isLoading}
                  className="p-4 rounded-xl flex flex-col items-center space-y-2 hover:scale-105 transform"
                >
                  <ZoomOut size={20} />
                  <span>Zoom Out</span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-8">
            <div className=" rounded-2xl shadow-xl overflow-hidden relative" style={{ marginTop: '-80px' }}>
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center  z-10">
                  <Loader2 size={48} className="animate-spin " />
                  <p className="text-xl mt-4 ">Loading Protein...</p>
                </div>
              )}
              <div
                ref={viewerRef}
                className="w-full"
                style={{ height: '600px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProteinViewer;