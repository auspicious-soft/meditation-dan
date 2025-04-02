"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Save, Plus, SquarePen } from 'lucide-react';
import { toast } from 'sonner';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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
      toast.error('Failed to load data');
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
      return;
    }

    setIsLoading(true);
    try {
      if (editingLevelId) {
        const payload = { name: editValue };
        const response = await updateLevels(`/admin/level/${editingLevelId}`, payload);
        if (response?.data?.success) {
          toast.success('Level updated successfully');
          setEditingLevelId(null);
          await fetchData(); // Reload data from backend
        } else {
          throw new Error(response?.data?.message || 'Failed to update level');
        }
      } else if (editingCategoryId) {
        const payload = { name: editValue };
        const response = await updateBestFor(`/admin/bestfor/${editingCategoryId}`, payload);
        if (response?.data?.success) {
          toast.success('Category updated successfully');
          setEditingCategoryId(null);
          await fetchData(); // Reload data from backend
        } else {
          throw new Error(response?.data?.message || 'Failed to update category');
        }
      }
      setEditValue('');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLevel = async (id: string) => {
    if (!id) {
      toast.error('Invalid level ID');
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteLevels(`/admin/delete-level/${id}`);
      if (response?.data?.success) {
        toast.success('Level deleted successfully');
        await fetchData(); // Reload data from backend
      } else {
        throw new Error(response?.data?.message || 'Failed to delete level');
      }
    } catch (error) {
      console.error('Error deleting level:', error);
      toast.error('Failed to delete level');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!id) {
      toast.error('Invalid category ID');
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteBestFor(`/admin/delete-bestfor/${id}`);
      if (response?.data?.success) {
        toast.success('Category deleted successfully');
        await fetchData(); // Reload data from backend
      } else {
        throw new Error(response?.data?.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const addNewLevel = async () => {
    setIsLoading(true);
    try {
      const newLevelName = 'New Level';
      const payload = { name: newLevelName };
      const response = await createLevels('/admin/create-level', payload);
      if (response?.data?.success) {
        const newLevel = {
          ...response.data.data,
          id: response.data.data.id || response.data.data._id,
        };
        setEditingLevelId(newLevel.id);
        setEditValue(newLevel.name);
        await fetchData(); // Reload data from backend
      } else {
        throw new Error(response?.data?.message || 'Failed to create level');
      }
    } catch (error) {
      console.error('Error creating level:', error);
      toast.error('Failed to create level');
    } finally {
      setIsLoading(false);
    }
  };

  const addNewCategory = async () => {
    setIsLoading(true);
    try {
      const newCategoryName = 'New Best For';
      const payload = { name: newCategoryName };
      const response = await createBestFor('/admin/create-bestfor', payload);
      if (response?.data?.success) {
        toast.success('New Best For created');
        const newCategory = {
          ...response.data.data,
          id: response.data.data.id || response.data.data._id,
        };
        setEditingCategoryId(newCategory.id);
        setEditValue(newCategory.name);
        await fetchData(); // Reload data from backend
      } else {
        throw new Error(response?.data?.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
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
                            onClick={() => deleteLevel(level.id)}
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
                disabled={isLoading}
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
                            onClick={() => deleteCategory(category.id)}
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
              </div>
            )}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default AudioLevelsManager;