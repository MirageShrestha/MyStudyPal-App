import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, getTasks, updateTask } from '../appwrite';

export const useTasks = (userId) => {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks', userId],
    queryFn: async () => {
      try {
        if (!userId) {
          console.log('No userId provided');
          return [];
        }
        console.log('Fetching tasks for userId:', userId);
        const response = await getTasks(userId);
        console.log('Tasks response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  const addTask = useMutation({
    mutationFn: async ({ title, subjectId, dueDate }) => {
      try {
        console.log('Adding task:', { userId, title, subjectId, dueDate });
        const response = await createTask(userId, title, subjectId, dueDate);
        console.log('Add task response:', response);
        return response;
      } catch (error) {
        console.error('Error adding task:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      alert(`Failed to add task: ${error.message}`);
    },
  });

  const editTask = useMutation({
    mutationFn: async ({ taskId, title, subjectId, dueDate }) => {
      try {
        console.log('Editing task:', { taskId, title, subjectId, dueDate });
        const response = await updateTask(taskId, title, subjectId, dueDate);
        console.log('Edit task response:', response);
        return response;
      } catch (error) {
        console.error('Error editing task:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    },
    onError: (error) => {
      alert(`Failed to update task: ${error.message}`);
    },
  });

  const toggleTaskStatus = useMutation({
    mutationFn: async () => null,
    onSuccess: () => {},
    onError: () => {},
  });

  const removeTask = useMutation({
    mutationFn: async (taskId) => {
      try {
        console.log('Removing task:', taskId);
        const response = await deleteTask(taskId);
        console.log('Remove task response:', response);
        return response;
      } catch (error) {
        console.error('Error removing task:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', userId] });
    },
    onError: (error) => {
      alert(`Failed to remove task: ${error.message}`);
    },
  });

  return {
    tasks,
    isLoading,
    error,
    addTask,
    editTask,
    toggleTaskStatus,
    removeTask,
  };
};