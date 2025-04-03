"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Save, Plus, SquarePen, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  createLevels,
  createBestFor,
  updateBestFor,
  updateLevels,
  deleteLevels,
  deleteBestFor,
  getlevelsStats,
  getBestForStats,
} from '@/services/admin-services';

// Define types for our data
interface AudioLevel {
  id: string;
  name: string;
  _id?: string;
}

interface Category {
  id: string;
  name: string;
  _id?: string;
}

const AudioLevelsManager = () => {
  const [audioLevels, setAudioLevels] = useState<AudioLevel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingLevelId, setEditingLevelId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'level' | 'category' } | null>(null);

  // Fetch data from backend
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const levelsResponse = await getlevelsStats('/level', {});
      const bestForResponse = await getBestForStats('/bestfor', {});

      console.log('Levels response:', levelsResponse);
      console.log('Best For response:', bestForResponse);

      if (levelsResponse?.data?.success) {
        const formattedLevels = levelsResponse.data.data.map((level: AudioLevel) => ({
          ...level,
          id: level.id || level._id,
        }));
        setAudioLevels(formattedLevels);
      } else {
        throw new Error(levelsResponse?.data?.message || 'Failed to fetch levels');
      }

      if (bestForResponse?.data?.success) {
        const formattedCategories = bestForResponse.data.data.map((category: Category) => ({
          ...category,
          id: category.id || category._id,
        }));
        setCategories(formattedCategories);
      } else {
        throw new Error(bestForResponse?.data?.message || 'Failed to fetch best for');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const startEditingLevel = (level: AudioLevel) => {
    setEditingLevelId(level.id);
    setEditValue(level.name);
  };

  const startEditingCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditValue(category.name);
  };

  const saveEdit = async () => {
    if (!editValue.trim()) {
      toast.error('Name cannot be empty');
      if (editingLevelId && !audioLevels.some(level => level.id === editingLevelId)) {
        setEditingLevelId(null);
      }
      if (editingCategoryId && !categories.some(cat => cat.id === editingCategoryId)) {
        setEditingCategoryId(null);
      }
      setEditValue('');
      return;
    }

    setIsLoading(true);
    try {
      if (editingLevelId) {
        const payload = { name: editValue };
        const response = await (audioLevels.some(level => level.id === editingLevelId)
          ? updateLevels(`/admin/level/${editingLevelId}`, payload)
          : createLevels('/admin/create-level', payload));
        if (response?.data?.success) {
          toast.success(audioLevels.some(level => level.id === editingLevelId) ? 'Level updated successfully' : 'Level created successfully');
          setEditingLevelId(null);
          await fetchData();
        } else {
          throw new Error(response?.data?.message || 'Failed to save level');
        }
      } else if (editingCategoryId) {
        const payload = { name: editValue };
        const response = await (categories.some(cat => cat.id === editingCategoryId)
          ? updateBestFor(`/admin/bestfor/${editingCategoryId}`, payload)
          : createBestFor('/admin/create-bestfor', payload));
        if (response?.data?.success) {
          toast.success(categories.some(cat => cat.id === editingCategoryId) ? 'Category updated successfully' : 'Category created successfully');
          setEditingCategoryId(null);
          await fetchData();
        } else {
          throw new Error(response?.data?.message || 'Failed to save category');
        }
      }
      setEditValue('');
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(
        error instanceof Error && (error as any)?.response?.data?.message
          ? (error as any).response.data.message
          : 'Failed to save item'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (id: string, type: 'level' | 'category') => {
    setItemToDelete({ id, type });
    setIsDialogOpen(true);
  };

  const cancelDelete = () => {
    setIsDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    try {
      const { id, type } = itemToDelete;
      const response = type === 'level'
        ? await deleteLevels(`/admin/delete-level/${id}`)
        : await deleteBestFor(`/admin/delete-bestfor/${id}`);

      if (response?.data?.success) {
        toast.success(type === 'level' ? 'Level deleted successfully' : 'Category deleted successfully');
        await fetchData();
      } else {
        throw new Error(response?.data?.message || `Failed to delete ${type}`);
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete?.type}:`, error);
      toast.error(error instanceof Error && (error as any)?.response?.data?.message 
        ? (error as any).response.data.message 
        : `Failed to delete ${itemToDelete?.type}`);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const addNewLevel = () => {
    setEditingLevelId('new-level');
    setEditValue('');
  };

  const addNewCategory = () => {
    setEditingCategoryId('new-category');
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingLevelId(null);
    setEditingCategoryId(null);
    setEditValue('');
  };

  return (
    <SkeletonTheme baseColor="#0B132B" highlightColor="#1B2236" borderRadius="0.5rem">
      <div className="p-6 bg-[#1B2236] text-white rounded-lg shadow-md">
        <div className="space-y-6">
          {/* Audio Levels Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Audio Level</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-[#1A3F70] hover:cursor-pointer hover:bg-[#1A3F70] p-2 hover:text-white"
                onClick={addNewLevel}
                disabled={isLoading || editingLevelId !== null || editingCategoryId !== null}
              >
                <Plus className="h-4 w-4 mr-1" /> Add New Level
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={48} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {audioLevels.map(level => (
                  <div
                    key={level.id}
                    className="bg-[#1B2236] rounded-md gap-2 flex justify-between items-center"
                  >
                    {editingLevelId === level.id ? (
                      <div className="flex-1 mr-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-[#0B132B] border-none w-full h-12 text-white"
                          disabled={isLoading}
                          placeholder="Enter level name"
                        />
                      </div>
                    ) : (
                      <span className="bg-[#0B132B] flex items-center py-2 px-3 rounded-lg h-12 border-none w-full text-white">
                        {level.name}
                      </span>
                    )}

                    <div className="flex space-x-2">
                      {editingLevelId === level.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={saveEdit}
                            disabled={isLoading}
                            className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                          >
                            <Save className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                            disabled={isLoading}
                            className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditingLevel(level)}
                            disabled={isLoading || editingLevelId !== null || editingCategoryId !== null}
                            className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                          >
                            <SquarePen className="h-4 w-4 text-white" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => confirmDelete(level.id, 'level')}
                            disabled={isLoading || editingLevelId !== null || editingCategoryId !== null}
                            className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4 text-[#ef4444]" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {editingLevelId === 'new-level' && (
                  <div className="bg-[#1B2236] rounded-md gap-2 flex justify-between items-center">
                    <div className="flex-1 mr-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-[#0B132B] border-none w-full h-12 text-white"
                        disabled={isLoading}
                        placeholder="Enter level name"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={saveEdit}
                        disabled={isLoading}
                        className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                      >
                        <Save className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Best For Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Best For</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-white bg-[#1A3F70] hover:cursor-pointer hover:bg-[#1A3F70] hover:text-white"
                onClick={addNewCategory}
                disabled={isLoading || editingLevelId !== null || editingCategoryId !== null}
              >
                <Plus className="h-4 w-4 mr-1" /> Add New Best For
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={48} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map(category => (
                  <div
                    key={category.id}
                    className="bg-[#1B2236] rounded-md gap-2 flex justify-between items-center"
                  >
                    {editingCategoryId === category.id ? (
                      <div className="flex-1 mr-2">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-[#0B132B] border-none w-full h-12 text-white"
                          disabled={isLoading}
                          placeholder="Enter category name"
                        />
                      </div>
                    ) : (
                      <span className="bg-[#0B132B] flex items-center py-2 px-3 rounded-lg h-12 border-none w-full text-white">
                        {category.name}
                      </span>
                    )}

                    <div className="flex space-x-2">
                      {editingCategoryId === category.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={saveEdit}
                            disabled={isLoading}
                            className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                          >
                            <Save className="h-4 w-4 text-blue-400" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEdit}
                            disabled={isLoading}
                            className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditingCategory(category)}
                            disabled={isLoading || editingLevelId !== null || editingCategoryId !== null}
                            className="hover:cursor-pointer bg-[#0B132B] hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                          >
                            <SquarePen className="h-4 w-4 text-white" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => confirmDelete(category.id, 'category')}
                            disabled={isLoading || editingLevelId !== null || editingCategoryId !== null}
                            className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {editingCategoryId === 'new-category' && (
                  <div className="bg-[#1B2236] rounded-md gap-2 flex justify-between items-center">
                    <div className="flex-1 mr-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-[#0B132B] border-none w-full h-12 text-white"
                        disabled={isLoading}
                        placeholder="Enter category name"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={saveEdit}
                        disabled={isLoading}
                        className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                      >
                        <Save className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={cancelEdit}
                        disabled={isLoading}
                        className="bg-[#0B132B] hover:cursor-pointer hover:bg-[#0B132B] h-12 w-12 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-[#1B2236] text-center w-96 flex flex-col justify-center items-center text-white border border-[#334155]">
            <DialogHeader className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-[#FEF3F2] rounded-full">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Delete {itemToDelete?.type === 'level' ? 'Level' : 'Category'}?
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-center">
                Are you sure you want to delete this {itemToDelete?.type === 'level' ? 'level' : 'category'}? <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex items-center justify-center gap-4">
              <Button
                className="bg-[#1A3F70] border-none hover:cursor-pointer text-white hover:bg-[#1A3F70] w-42"
                onClick={cancelDelete}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#FF4747] border-none hover:cursor-pointer hover:bg-[#FF4747] w-42"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SkeletonTheme>
  );
};

export default AudioLevelsManager;