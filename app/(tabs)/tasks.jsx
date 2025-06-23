import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TaskForm from '../../components/TaskForm';
import TaskItem from '../../components/TaskItem';
import { useTasks } from '../../lib/hooks/useTasks';

export default function TasksScreen() {
  const { user } = useUser();
  const { tasks, isLoading, error, addTask, removeTask, toggleTaskStatus } = useTasks(user?.id);
  const [isFormVisible, setIsFormVisible] = useState(false);

  console.log('Current user ID:', user?.id);
  console.log('Tasks data:', tasks);
  console.log('Loading:', isLoading);
  console.log('Error:', error);

  const handleAddTask = (data) => {
    addTask.mutate(data);
    setIsFormVisible(false);
  };

  const handleToggleStatus = (taskId, currentStatus) => {
    toggleTaskStatus.mutate({ taskId, currentStatus });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Error Loading Tasks</Text>
        <Text style={styles.errorText}>{error.message}</Text>
      </View>
    );
  }

  const sortTasks = (tasks) => {
    if (!tasks?.documents) return [];
    return [...tasks.documents].sort((a, b) => {
      // First sort by status (pending first, then in_progress, then completed)
      const statusOrder = { pending: 0, in_progress: 1, completed: 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // Then sort by due date
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  };

  const sortedTasks = sortTasks(tasks);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskItem 
              key={task.$id} 
              task={task} 
              onDelete={removeTask.mutate}
              onToggleStatus={handleToggleStatus}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="list-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No Tasks Yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first task to start tracking your assignments and study goals
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isFormVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsFormVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Task</Text>
              <TouchableOpacity onPress={() => setIsFormVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <TaskForm onAddTask={handleAddTask} />
          </View>
        </View>
      </Modal>
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setIsFormVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8E8E93',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
