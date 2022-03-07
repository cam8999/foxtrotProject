import { React, useState } from 'react';
import { View, Text, TouchableHighlight} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Searchbar } from 'react-native-paper';

import Colours, { AppStyle } from "../styles";


const searchOptionList = ['Title', 'Tags', 'Location', 'Username'];

function TopBar(props) {
  const [checked, setChecked] = useState('Title');
  const [searchQuery, setSearchQuery] = useState('');

  renderRadioForm = () => 
    <View style={AppStyle.radioButtonContainer}>
      <Text style={AppStyle.textInput}>Search by:</Text>
      <RadioForm formHorizontal={true} style={{ justifyContent: 'space-around', flex: 9 }}>
        {searchOptionList.map(label => (
          <RadioButton key={label}>
            <RadioButtonInput
              obj={label}
              index={label}
              isSelected={checked === label}
              onPress={setChecked(label)}
              buttonSize={10}
              buttonInnerColor={'white'}
              buttonOuterColor={'white'}
            />
            <RadioButtonLabel
              obj={label}
              index={label}
              onPress={setChecked(label)}
              labelWrapStyle={{ marginHorizontal: 5 }}
              labelStyle={{ color: 'white' }}
            />
          </RadioButton>
        ))}
      </RadioForm>
    </View>

  
  onSearch = () => {
    //props.navigation.navigate('Home');
    props.onSearch(searchQuery, checked);
    setSearchQuery('');
  }

  
  return (
    <View style={AppStyle.topBar}>
      {/* Post button */}
      <View style={AppStyle.homeButton}>
        <TouchableHighlight 
          //props.navigation.navigate('Home')}
          underlayColor={Colours.PRIMARY}
        >
          <Ionicons name="home" size={25} color={'white'} />
        </TouchableHighlight>
      </View>

      {/* Search Bar */}
      <View style={AppStyle.searchBarContainer}>
        <Searchbar
          style={AppStyle.searchBar}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={onSearch}
        />
        {renderRadioForm()}
      </View>
    </View>
  )
}

export default TopBar;