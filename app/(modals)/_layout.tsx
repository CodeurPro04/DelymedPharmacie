import { Stack } from 'expo-router';
import Colors from '../../constants/Colors';

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.primaryDark,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    />
  );
}
