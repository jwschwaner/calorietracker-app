import React, { useState, useEffect } from 'react';
import {
    Modal,
    SafeAreaView,
    View,
    Text,
    Button,
    TextInput,
    StyleSheet,
    Keyboard
} from 'react-native';

import {
    UserDataModel,
    Gender,
    ActivityLevel,
    Goal
} from '../utils/models/UserData';

type UserDataDrawerComponentProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (userData: UserDataModel) => void;
    existingUserData?: UserDataModel;
};

export const UserDataDrawerComponent: React.FC<UserDataDrawerComponentProps> = ({
                                                                                    visible,
                                                                                    onClose,
                                                                                    onSubmit,
                                                                                    existingUserData,
                                                                                }) => {

    // Local state for form fields
    const [gender, setGender] = useState<Gender>(Gender.male);
    const [age, setAge] = useState('30');
    const [height, setHeight] = useState('180');
    const [weight, setWeight] = useState('75');
    const [activityLevel, setActivityLevel] = useState<ActivityLevel>(ActivityLevel.moderate);
    const [goal, setGoal] = useState<Goal>(Goal.loseWeight);

    useEffect(() => {
        if (existingUserData) {
            setGender(existingUserData.gender);
            setAge(String(existingUserData.age));
            setHeight(String(existingUserData.height));
            setWeight(String(existingUserData.weight));
            setActivityLevel(existingUserData.activityLevel);
            setGoal(existingUserData.goal);
        }
    }, [existingUserData]);

    const handleSubmit = () => {
        const userModel = new UserDataModel(
            gender,
            Number(age),
            Number(height),
            Number(weight),
            activityLevel,
            goal
        );
        onSubmit(userModel);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            {/* SafeAreaView ensures the content is visible below the notch */}
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Enter Your Details</Text>

                    {/* Gender row */}
                    <Text style={styles.label}>Gender:</Text>
                    <View style={styles.buttonRow}>
                        <Button
                            title="Male"
                            onPress={() => setGender(Gender.male)}
                            color={gender === Gender.male ? '#007AFF' : '#8E8E93'}
                        />
                        <Button
                            title="Female"
                            onPress={() => setGender(Gender.female)}
                            color={gender === Gender.female ? '#007AFF' : '#8E8E93'}
                        />
                    </View>

                    {/* Age (numeric) */}
                    <Text style={styles.label}>Age:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={age}
                        onChangeText={setAge}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={Keyboard.dismiss}
                    />

                    {/* Height (numeric) */}
                    <Text style={styles.label}>Height (cm):</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={height}
                        onChangeText={setHeight}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={Keyboard.dismiss}
                    />

                    {/* Weight (numeric) */}
                    <Text style={styles.label}>Weight (kg):</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                        returnKeyType="done"
                        blurOnSubmit={true}
                        onSubmitEditing={Keyboard.dismiss}
                    />

                    {/* Activity Level (buttons) */}
                    <Text style={styles.label}>Activity Level:</Text>
                    <View style={styles.buttonRow}>
                        <Button
                            title="Sedentary"
                            onPress={() => setActivityLevel(ActivityLevel.sedentary)}
                            color={activityLevel === ActivityLevel.sedentary ? '#007AFF' : '#8E8E93'}
                        />
                        <Button
                            title="Light"
                            onPress={() => setActivityLevel(ActivityLevel.light)}
                            color={activityLevel === ActivityLevel.light ? '#007AFF' : '#8E8E93'}
                        />
                        <Button
                            title="Moderate"
                            onPress={() => setActivityLevel(ActivityLevel.moderate)}
                            color={activityLevel === ActivityLevel.moderate ? '#007AFF' : '#8E8E93'}
                        />
                    </View>
                    <View style={styles.buttonRow}>
                        <Button
                            title="Active"
                            onPress={() => setActivityLevel(ActivityLevel.active)}
                            color={activityLevel === ActivityLevel.active ? '#007AFF' : '#8E8E93'}
                        />
                        <Button
                            title="Very Active"
                            onPress={() => setActivityLevel(ActivityLevel.veryActive)}
                            color={activityLevel === ActivityLevel.veryActive ? '#007AFF' : '#8E8E93'}
                        />
                    </View>

                    {/* Goal (buttons) */}
                    <Text style={styles.label}>Goal:</Text>
                    <View style={styles.buttonRow}>
                        <Button
                            title="Lose Weight"
                            onPress={() => setGoal(Goal.loseWeight)}
                            color={goal === Goal.loseWeight ? '#007AFF' : '#8E8E93'}
                        />
                        <Button
                            title="Maintain"
                            onPress={() => setGoal(Goal.maintainWeight)}
                            color={goal === Goal.maintainWeight ? '#007AFF' : '#8E8E93'}
                        />
                        <Button
                            title="Gain Weight"
                            onPress={() => setGoal(Goal.gainWeight)}
                            color={goal === Goal.gainWeight ? '#007AFF' : '#8E8E93'}
                        />
                    </View>

                    {/* Submit / Cancel */}
                    <View style={{ marginTop: 20 }}>
                        <Button title="Submit" onPress={handleSubmit} />
                        <Button title="Cancel" onPress={onClose} />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        marginBottom: 12,
        fontWeight: '600',
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
    },
});
