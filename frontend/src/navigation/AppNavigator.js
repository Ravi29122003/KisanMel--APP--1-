import CropRecommendationScreen from '../screens/CropRecommendationScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="CropRecommendation" 
        component={CropRecommendationScreen}
        options={{ title: 'Crop Recommendations' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 