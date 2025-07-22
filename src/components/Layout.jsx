import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Drawer from './Drawer';
import { BeakerIcon, CubeTransparentIcon, ClipboardDocumentListIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const defaultNotes = [
  { id: 1, text: 'Check binding affinity for CHEMBL25.' },
  { id: 2, text: 'Compare structures of Aspirin and Ibuprofen.' },
];

function Layout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(() => localStorage.getItem('drawerOpen') === 'true');
  const [drawerWidth, setDrawerWidth] = useState(() => parseInt(localStorage.getItem('drawerWidth'), 10) || 350);

  const [notes, setNotes] = useState(() => {
    try {
      const savedNotes = localStorage.getItem('userNotes');
      return savedNotes ? JSON.parse(savedNotes) : defaultNotes;
    } catch (error) {
      console.error("Failed to parse notes from localStorage", error);
      return defaultNotes;
    }
  });
  const [newNote, setNewNote] = useState('');

  useEffect(() => { localStorage.setItem('drawerOpen', isDrawerOpen); }, [isDrawerOpen]);
  useEffect(() => { localStorage.setItem('drawerWidth', drawerWidth); }, [drawerWidth]);
  useEffect(() => {
    localStorage.setItem('userNotes', JSON.stringify(notes));
  }, [notes]);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.trim() === '') return;
    setNotes([...notes, { id: Date.now(), text: newNote.trim() }]);
    setNewNote('');
  };

  const handleDeleteNote = (idToDelete) => {
    setNotes(notes.filter(note => note.id !== idToDelete));
  };

  const linkClass = ({ isActive }) =>
    `flex items-center p-3 my-1 rounded-lg transition-colors text-gray-700 font-medium border-l-4 ${
      isActive ? 'bg-blue-50 text-blue-600 border-blue-500' : 'border-transparent hover:bg-gray-100'
    }`;

  return (
    <div className="bg-slate-50 relative overflow-x-hidden">
      <Drawer isOpen={isDrawerOpen} width={drawerWidth} setWidth={setDrawerWidth}>
        <div className="h-full flex flex-col bg-white">

          <div className="p-4 border-b flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-800">My Notes</h3>
          </div>
          
          <div className="p-4 border-b bg-gray-50 space-y-4 flex-shrink-0">
            <form onSubmit={handleAddNote} className="flex">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 border rounded-l-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-r-md text-sm font-medium flex items-center"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </form>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setNotes([])} className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md text-base font-medium">
                Clear All
              </button>
              <button onClick={toggleDrawer} className="w-full font-medium py-3 px-4 rounded-md transition-colors border bg-white hover:bg-gray-100 text-base">
                Close
              </button>
            </div>
          </div>

          <div className="p-4 flex-grow overflow-y-auto">
            {notes.length > 0 ? (
              <ul className="space-y-3">
                {notes.map(note => (
                  <li key={note.id} className="flex items-start justify-between group text-sm text-gray-700">
                    <span className="flex-grow pr-2">{note.text}</span>
                    <button onClick={() => handleDeleteNote(note.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center mt-4">No notes yet.</p>
            )}
          </div>
        </div>
      </Drawer>

      <div
        className="h-screen transition-transform duration-300 ease-in-out"
        style={{ transform: isDrawerOpen ? `translateX(${drawerWidth}px)` : 'translateX(0)' }}
      >
        <div className="flex h-full">
          <aside className="w-64 bg-white shadow-md flex flex-col flex-shrink-0 z-10 border-r">
            <div className="p-4 border-b h-20 flex items-center">
              <h2 className="text-2xl font-bold text-blue-600">BioApp</h2>
            </div>
            <nav className="flex-grow p-4">
              <NavLink to="/" className={linkClass}><BeakerIcon className="h-6 w-6 mr-3" /> Ligand Database</NavLink>
              <NavLink to="/protein" className={linkClass}><CubeTransparentIcon className="h-6 w-6 mr-3" /> Protein Viewer</NavLink>
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={toggleDrawer}
                className="w-full flex items-center p-3 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                <ClipboardDocumentListIcon className="h-6 w-6 mr-3" /> My Notes
              </button>
            </div>
          </aside>
          
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default Layout;