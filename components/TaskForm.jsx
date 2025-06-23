import { useUser } from '@clerk/clerk-expo';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSubjects } from '../lib/hooks/useSubjects';

const TaskForm = ({ onAddTask }) => {
  const { user } = useUser();
  const { subjects } = useSubjects(user?.id);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const handleSubmit = () => {
    if (!title || !dueDate || !subjectId) {
      alert('Please fill in all fields.');
      return;
    }
    
    onAddTask({ title, dueDate, subjectId });
    setTitle('');
    setDueDate('');
    setSubjectId('');
  };

  if (!subjects?.documents?.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.warningText}>
          Please add at least one subject before creating a task.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={subjectId}
          onValueChange={(itemValue) => setSubjectId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a Subject" value="" />
          {subjects?.documents?.map((subject) => (
            <Picker.Item
              key={subject.$id}
              label={subject.Name}
              value={subject.$id}
            />
          ))}
        </Picker>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
      />
      <Button title="Add Task" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  warningText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default TaskForm;
