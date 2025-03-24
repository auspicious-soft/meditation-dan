"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Save, Plus, SquarePen } from 'lucide-react';

// Define types for our data
interface AudioLevel {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const AudioLevelsManager = () => {
  // Mock data - in a real app, this would come from your database
  const [audioLevels, setAudioLevels] = useState<AudioLevel[]>([
    { id: '1', name: 'Beginner' },
    { id: '2', name: 'Rectangle 6698' },
    { id: '3', name: 'Advanced' },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'All' },
    { id: '2', name: 'Relaxation' },
    { id: '3', name: 'Breathing' },
    { id: '4', name: 'Focus' },
    { id: '5', name: 'Nature' },
    { id: '6', name: 'Healing' },
  ]);

  // State for editing
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Handle editing for audio levels
  const startEditingLevel = (level: AudioLevel) => {
    setEditingLevelId(level.id);
    setEditValue(level.name);
  };

  // Handle editing for categories
  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditValue(category.name);
  };

  // Save edited value
  const saveEdit = () => {
    if (editingLevelId) {
      setAudioLevels(audioLevels.map(level => 
        level.id === editingLevelId ? { ...level, name: editValue } : level
      ));
      setEditingLevelId(null);
    } else if (editingCategoryId) {
      setCategories(categories.map(category => 
        category.id === editingCategoryId ? { ...category, name: editValue } : category
      ));
      setEditingCategoryId(null);
    }
    setEditValue('');
  };

  // Delete item
  const deleteLevel = (id: string) => {
    setAudioLevels(audioLevels.filter(level => level.id !== id));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  // Add new item
  // const addNewLevel = () => {
  //   const newId = String(Date.now());
  //   setAudioLevels([...audioLevels, { id: newId, name: 'New Level' }]);
  //   setEditingLevelId(newId);
  //   setEditValue('New Level');
  // };

  // const addNewCategory = () => {
  //   const newId = String(Date.now());
  //   setCategories([...categories, { id: newId, name: 'New Category' }]);
  //   setEditingCategoryId(newId);
  //   setEditValue('New Category');
  // };

  return (
<div className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md">
     
        <div className="space-y-6">
          {/* Audio Levels Section */}
          <div>
            <div className="flex  justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Audio Level</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white bg-[#1A3F70] hover:bg-[#1A3F70] p-2 hover:text-white" 
                // onClick={addNewLevel}
              >
                <Plus className="h-4 w-4 mr-1" /> Add New Level
              </Button>
            </div>

            <div className="space-y-3">
              {audioLevels.map(level => (
                <div 
                  key={level.id} 
                  className={`bg-[#1B2236] rounded-md gap-2 flex justify-between items-center `}
                >
                  {editingLevelId === level.id ? (
                    <div className="flex-1 mr-2">
                      <Input 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                    className="bg-[#0B132B] border-none w-full h-12 text-white"
                      />
                    </div>
                  ) : (
                    
                    <span className='bg-[#0B132B] flex items-center py-2 px-3 rounded-lg h-12  border-none w-full text-white'>{level.name}</span>
                  )}
                  
                  <div className="flex space-x-2">
                    {editingLevelId === level.id ? (
                      <Button size="sm" variant="ghost" onClick={saveEdit} className='bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl'>
                        <Save className="h-12 w-12 text-blue-400" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => startEditingLevel(level)} className='bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl'>
                        <SquarePen className="h-12 w-12 text-white" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteLevel(level.id)} className='bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl'>
                      <Trash2 className="h-12 w-12 text-[#ef4444]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Best For Section */}
          <div>
            <div className="flex  justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Best For</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white bg-[#1A3F70] hover:bg-[#1A3F70] hover:text-white" 
                // onClick={addNewCategory}
              >
                <Plus className="h-4 w-4 mr-1" /> Add New Best For
              </Button>
            </div>

            <div className="space-y-3">
              {categories.map(category => (
               <div 
               key={category.id} 
               className={`bg-[#1B2236] rounded-md gap-2 flex justify-between items-center `}
             >
                  {editingCategoryId === category.id ? (
                    <div className="flex-1 mr-2">
                      <Input 
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-[#0B132B] border-none w-full h-12 text-white"
                      />
                    </div>
                  ) : (
                    <span className='bg-[#0B132B] flex items-center py-2 px-3 rounded-lg h-12  border-none w-full text-white'>{category.name}</span>
                  )}
                  
                  <div className="flex space-x-2">
                    {editingCategoryId === category.id ? (
                      <Button size="sm" variant="ghost" onClick={saveEdit} className='bg-[#0B132B]  hover:cursor-pointer hover:bg-[#0B132B]  h-12 w-12 rounded-xl'>
                        <Save className="h-4 w-4 text-blue-400" />
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => startEditingCategory(category)} className='hover:cursor-pointer bg-[#0B132B] hover:bg-[#0B132B]  h-12 w-12 rounded-xl'>
                        <SquarePen className="h-4 w-4 text-white" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteCategory(category.id)} className='bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B]  h-12 w-12 rounded-xl'>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6">
            <Button className="w-52 h-11 bg-[#1A3F70] hover:bg-[#1A3F70]">
              Save
            </Button>
          </div>
        </div>
      
    </div>
  );
};

export default AudioLevelsManager;