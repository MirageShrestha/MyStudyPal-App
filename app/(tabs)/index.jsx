// Step 2: Dashboard/Home Screen (app/(tabs)/index.jsx)
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useExams } from '../../lib/hooks/useExams';
import { useSubjects } from '../../lib/hooks/useSubjects';
import { useTasks } from '../../lib/hooks/useTasks';

export default function DashboardScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  // Fetch data
  const { tasks } = useTasks(user?.id);
  const { subjects } = useSubjects(user?.id);
  const { exams } = useExams(user?.id);

  // Helper to get count safely
  const getCount = (data) => (data && data.documents ? data.documents.length : 0);

  // Gather recent activity from all types
  const recentItems = [];
  if (tasks?.documents) {
    tasks.documents.forEach((task) => recentItems.push({
      type: 'Task',
      title: task.Title,
      date: task.dueDate,
      createdAt: task?.$createdAt || task.dueDate,
    }));
  }
  if (subjects?.documents) {
    subjects.documents.forEach((subject) => recentItems.push({
      type: 'Subject',
      title: subject.Name,
      date: null,
      createdAt: subject?.$createdAt,
    }));
  }
  if (exams?.documents) {
    exams.documents.forEach((exam) => recentItems.push({
      type: 'Exam',
      title: exam.title,
      date: exam.date,
      createdAt: exam?.$createdAt || exam.date,
    }));
  }
  // Sort by createdAt descending and take the 5 most recent
  const sortedRecent = recentItems
    .filter(item => item.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            Welcome back, {user?.firstName || 'Student'}!
          </Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getCount(tasks)}</Text>
          <Text style={styles.statLabel}>Active Tasks</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getCount(subjects)}</Text>
          <Text style={styles.statLabel}>Subjects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getCount(exams)}</Text>
          <Text style={styles.statLabel}>Upcoming Exams</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/subjects')}
          >
            <Ionicons name="add-circle" size={32} color="#007AFF" />
            <Text style={styles.actionText}>Add Subject</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/tasks')}
          >
            <Ionicons name="checkbox" size={32} color="#34C759" />
            <Text style={styles.actionText}>Add Task</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/exams')}
          >
            <Ionicons name="calendar" size={32} color="#FF3B30" />
            <Text style={styles.actionText}>Add Exam</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {sortedRecent.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={48} color="#8E8E93" />
            <Text style={styles.emptyText}>No recent activity</Text>
            <Text style={styles.emptySubtext}>Start by adding a subject or task</Text>
          </View>
        ) : (
          <View>
            {sortedRecent.map((item, idx) => (
              <View key={idx} style={styles.activityItem}>
                <Ionicons
                  name={
                    item.type === 'Task' ? 'checkbox-outline' :
                    item.type === 'Subject' ? 'book-outline' :
                    'school-outline'
                  }
                  size={24}
                  color={item.type === 'Task' ? '#34C759' : item.type === 'Subject' ? '#007AFF' : '#FF3B30'}
                  style={{ marginRight: 12 }}
                />
                <View>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityMeta}>
                    {item.type} {item.date ? `- ${new Date(item.date).toLocaleDateString()}` : ''}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  profileButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    color: '#1C1C1E',
    marginTop: 8,
    fontWeight: '500',
  },
  recentActivity: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  emptyState: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  activityMeta: {
    fontSize: 13,
    color: '#8E8E93',
  },
});