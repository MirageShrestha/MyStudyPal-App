// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { createSubject, deleteSubject, getSubjects, updateSubject } from '../appwrite';

// export const useSubjects = () => {
//   const queryClient = useQueryClient();

//   // v5 syntax: useQuery expects an object with queryKey and queryFn
//   const { data: subjects, isLoading, error } = useQuery({
//     queryKey: ['subjects'],
//     queryFn: getSubjects,
//   });

//   // v5 syntax: useMutation expects an object with mutationFn and options
//   const addSubject = useMutation({
//     mutationFn: createSubject,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['subjects'] });
//     },
//   });

//   const editSubject = useMutation({
//     mutationFn: updateSubject,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['subjects'] });
//     },
//   });

//   const removeSubject = useMutation({
//     mutationFn: deleteSubject,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['subjects'] });
//     },
//   });

//   return {
//     subjects,
//     isLoading,
//     error,
//     addSubject,
//     editSubject,
//     removeSubject,
//   };
// };





import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createSubject, deleteSubject, getSubjects, updateSubject } from '../appwrite';

export const useSubjects = (userId) => {
  const queryClient = useQueryClient();

  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ['subjects', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getSubjects(userId);
    },
    enabled: !!userId,
  });

  const addSubject = useMutation({
    mutationFn: async ({ name, description }) => {
      return await createSubject(userId, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', userId] });
    },
    onError: (error) => {
      alert(`Failed to add subject: ${error.message}`);
    },
  });

  const editSubject = useMutation({
    mutationFn: ({ subjectId, name, description }) => updateSubject(subjectId, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', userId] });
    },
    onError: (error) => {
      alert(`Failed to update subject: ${error.message}`);
    },
  });

  const removeSubject = useMutation({
    mutationFn: (subjectId) => deleteSubject(subjectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', userId] });
    },
    onError: (error) => {
      alert(`Failed to remove subject: ${error.message}`);
    },
  });

  return {
    subjects,
    isLoading,
    error,
    addSubject,
    editSubject,
    removeSubject,
  };
};