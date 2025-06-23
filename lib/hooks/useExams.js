import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createExam, deleteExam, getExams, updateExam } from '../appwrite';

export const useExams = (userId) => {
  const queryClient = useQueryClient();

  const { data: exams, isLoading, error } = useQuery({
    queryKey: ['exams', userId],
    queryFn: async () => {
      try {
        if (!userId) {
          console.log('No userId provided');
          return [];
        }
        console.log('Fetching exams for userId:', userId);
        const response = await getExams(userId);
        console.log('Exams response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching exams:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  const addExam = useMutation({
    mutationFn: async ({ title, date }) => {
      try {
        console.log('Adding exam:', { userId, title, date });
        const response = await createExam(userId, title, date);
        console.log('Add exam response:', response);
        return response;
      } catch (error) {
        console.error('Error adding exam:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', userId] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      alert(`Failed to add exam: ${error.message}`);
    },
  });

  const editExam = useMutation({
    mutationFn: async ({ examId, title, date }) => {
      try {
        console.log('Editing exam:', { examId, title, date });
        const response = await updateExam(examId, title, date);
        console.log('Edit exam response:', response);
        return response;
      } catch (error) {
        console.error('Error editing exam:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', userId] });
    },
    onError: (error) => {
      alert(`Failed to update exam: ${error.message}`);
    },
  });

  const removeExam = useMutation({
    mutationFn: async (examId) => {
      try {
        console.log('Removing exam:', examId);
        const response = await deleteExam(examId);
        console.log('Remove exam response:', response);
        return response;
      } catch (error) {
        console.error('Error removing exam:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams', userId] });
    },
    onError: (error) => {
      alert(`Failed to remove exam: ${error.message}`);
    },
  });

  return {
    exams,
    isLoading,
    error,
    addExam,
    editExam,
    removeExam,
  };
};