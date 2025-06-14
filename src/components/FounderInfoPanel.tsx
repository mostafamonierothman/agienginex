
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const FOUNDER_INFO_KEY = 'agi_founder_info';

export const FounderInfoPanel = ({
  onUpdate,
}: {
  onUpdate?: (info: { name: string; bio: string }) => void;
}) => {
  const [name, setName] = useState('Mostafa Monier Othman');
  const [bio, setBio] = useState("Founder of AGIengineX. Visionary driving advanced AGI capabilities.");
  const [editing, setEditing] = useState(false);

  // Load from localStorage first
  useEffect(() => {
    const saved = localStorage.getItem(FOUNDER_INFO_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setName(data.name || name);
        setBio(data.bio || bio);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (onUpdate) onUpdate({ name, bio });
  }, [name, bio, onUpdate]);

  const saveInfo = () => {
    localStorage.setItem(FOUNDER_INFO_KEY, JSON.stringify({ name, bio }));
    setEditing(false);
    if (onUpdate) onUpdate({ name, bio });
  };

  return (
    <div className="mb-2 flex items-center gap-4 p-2 bg-slate-50 border rounded">
      {editing ? (
        <form
          className="flex gap-2 w-full"
          onSubmit={e => {
            e.preventDefault();
            saveInfo();
          }}
        >
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            className="text-base"
            placeholder="Founder Name"
          />
          <Input
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="text-base"
            placeholder="Short Bio"
          />
          <Button type="submit" variant="secondary" className="h-10">Save</Button>
          <Button type="button" variant="ghost" className="h-10" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <div className="flex items-center w-full gap-3">
          <div>
            <span className="font-bold">{name}</span>
            <span className="text-xs text-gray-500 ml-2">({bio})</span>
          </div>
          <Button size="sm" variant="outline" className="ml-auto h-7" onClick={() => setEditing(true)}>
            Edit Founder Info
          </Button>
        </div>
      )}
    </div>
  );
};
