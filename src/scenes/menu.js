import * as React from 'react';
import { View, Text } from 'react-native';
import { RadioButton } from 'react-native-paper';

const Menu2 = () => {
  const [checked, setChecked] = React.useState('first');

  return (
    <View style={{ width:"20%", flexDirection: "row"}}>
      <RadioButton.Item
        value="general"
        label = "General"
        status={ checked === 'first' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('first')}
      />
      <RadioButton.Item
        label="Type"
        value="type"
        status={ checked === 'second' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('second')}
      />

<RadioButton.Item
        
        color='black'
        value="Title"
        label = "Title"
        status={ checked === 'first' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('first')}
      />
      <RadioButton.Item
        label="Location"
        value="location"
        status={ checked === 'second' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('second')}
      />
    </View>
  );
};

export default Menu2;