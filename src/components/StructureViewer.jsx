import React from 'react';
import { AlertCircle } from 'lucide-react';

function StructureViewer({ svgContent, error }) {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <AlertCircle size={48} className="mb-2" />
        <p className="text-sm">Invalid SMILES String</p>
      </div>
    );
  }

  if (!svgContent) {
    return null;
  }

  return <div className="w-full h-full flex items-center justify-center" dangerouslySetInnerHTML={{ __html: svgContent }} />;
}

export default StructureViewer;