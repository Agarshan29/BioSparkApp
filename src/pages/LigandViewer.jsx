import React, { useState, useEffect } from 'react';
import {
    Activity, Loader2, FlaskConical, Beaker, Atom
} from 'lucide-react';

import ligandData from '../data/ligands.json';
import { getRDKit } from '../utils/rdkit';

import StructureViewer from '../components/StructureViewer';

function LigandViewer() {
    const [rdkit, setRdkit] = useState(null);
    const [selectedLigand, setSelectedLigand] = useState(ligandData[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [structureSvg, setStructureSvg] = useState(null);
    const [descriptors, setDescriptors] = useState(null);
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getRDKit().then(setRdkit).catch(console.error);
    }, []);

    useEffect(() => {
        if (!rdkit || !selectedLigand) return;
        setIsLoading(true);
        setError(false);

        const mol = rdkit.get_mol(selectedLigand.smiles);
        if (mol) {
            setStructureSvg(mol.get_svg());
            try {
                const rawString = mol.get_descriptors().replace(/NaN/g, 'null');
                setDescriptors(JSON.parse(rawString));
            } catch (e) {
                setDescriptors(null);
                console.error("Descriptor calculation failed:", e);
            }
            mol.delete();
        } else {
            setError(true);
        }
        setIsLoading(false);
    }, [selectedLigand, rdkit]);

    const filteredLigands = ligandData.filter(ligand =>
        ligand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ligand.chemblId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const descriptorCards = [
        { label: 'Molecular Weight', value: descriptors?.amw, unit: 'g/mol', icon: Atom},
        { label: 'LogP', value: descriptors?.CrippenClogP, unit: '', icon: Activity},
        { label: 'TPSA', value: descriptors?.tpsa, unit: 'Å²', icon: Beaker},
        { label: 'H-Bond Donors', value: descriptors?.NumHBD, unit: '', icon: Activity},
        { label: 'H-Bond Acceptors', value: descriptors?.NumHBA, unit: '', icon: Activity},
        { label: 'Rotatable Bonds', value: descriptors?.NumRotatableBonds, unit: '', icon: Activity}
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="bg-gray-800 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-8 py-10 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <FlaskConical size={36} />
                        <h1 className="text-4xl font-extrabold tracking-tight">Ligand Explorer</h1>
                    </div>
                    <div className="flex items-center space-x-6">
                        <span className="text-base font-medium">{ligandData.length} Compounds</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-12 flex gap-10">
             
                <div className="w-80 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                
                    <div className="p-6 border-b">
                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                            <Beaker size={24} className="mr-2" />
                            Compound Library
                        </h2>
                    
                        <div className="w-full">
                            <input
                                type="text"
                                placeholder="Search compounds..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none transition"
                            />
                        </div>
                    </div>

              
                    <div className="flex-1 overflow-y-auto p-3" style={{ overflowX: 'hidden' }}>
                        <div className="space-y-3">
                            {filteredLigands.map((ligand) => (
                                <div
                                    key={ligand.chemblId}
                                    onClick={() => setSelectedLigand(ligand)}
                                    className={`rounded-xl cursor-pointer transition transform border ${selectedLigand?.chemblId === ligand.chemblId
                                        ? 'bg-gray-200 border-gray-300'
                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                        }`}
                                    style={{ padding: '0.75rem', margin: '0.25rem' }} // Added inline styles
                                >
                                    <div className="hover:scale-105 transition-transform duration-200" style={{ padding: '0.125rem' }}>
                                        <h3 className="font-semibold text-lg text-gray-900 mb-0.5" style={{ wordBreak: 'break-word' }}>{ligand.name}</h3>
                                        <p className="text-gray-600 text-sm" style={{ wordBreak: 'break-word' }}>{ligand.chemblId}</p>
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold">
                                            {ligand.type}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

   
                <div className="flex-1 space-y-10">
                    <div className="bg-white rounded-2xl shadow-xl p-10">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold mb-2">{selectedLigand?.name}</h2>
                            <p className="text-gray-600 text-lg">ChEMBL ID: {selectedLigand?.chemblId}</p>
                        </div>

                        <div className="h-96 rounded-2xl border border-gray-200 flex items-center justify-center relative overflow-hidden">
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={50} />
                            ) : (
                                <StructureViewer svgContent={structureSvg} error={error} />
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {descriptorCards.map((card, index) => (
                            <div
                                key={index}
                                className={`rounded-xl border border-gray-200 shadow transition h-40 bg-white`}
                                style={{ padding: '1rem' }}
                            >
                                <div className="hover:scale-105 transition-transform duration-200" style={{ padding: '0.5rem' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className=" p-3 rounded-lg shadow">
                                            <card.icon size={24} className="text-gray-700" />
                                        </div>
                                        <span className="text-base font-semibold text-gray-600">{card.label}</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {isLoading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            card.value !== null && typeof card.value === 'number'
                                                ? `${card.value.toFixed(2)}${card.unit ? ' ' + card.unit : ''}`
                                                : 'N/A'
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center">
                            <Activity size={24} className="mr-3" />
                            SMILES Notation
                        </h3>
                        <div className="relative bg-gray-50 rounded-xl p-6 font-mono text-gray-800 overflow-x-auto text-base">
                            {selectedLigand?.smiles || 'Select a ligand to view its SMILES notation'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LigandViewer;