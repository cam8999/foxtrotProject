import { React, useState } from 'react';
import { View, Text, TouchableHighlight} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Searchbar } from 'react-native-paper';

import Colours, { AppStyle } from "../styles";


const searchOptionList = [
  { label: 'Title', value: 'title', },
  { label: 'Author', value: 'author', },
  { label: 'Tags', value: 'tags', },
  { label: 'Location', value: 'loc', },
];

TopBar = ({navigation, onSearch}) => {
  const [checked, setChecked] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');
  
  const onQuery = () => {
    //props.navigation.navigate('Home');
    onSearch(searchQuery, checked);
    setSearchQuery('');
  }

  
  const renderRadioForm =
    <View style={AppStyle.radioButtonContainer}>
      <Text style={{ color: 'white', flex: 2}}>Search by:</Text>
      <RadioForm 
        formHorizontal={true}
        style={{ justifyContent: 'space-around', flex: 8 }}>
        {searchOptionList.map((l, v) => (
          <RadioButton key={v}>
            <RadioButtonInput
              obj={l}
              index={v}
              isSelected={checked === v}
              onPress={() => setChecked(v)}
              buttonSize={10}
              buttonInnerColor={'white'}
              buttonOuterColor={'white'}
            />
            <RadioButtonLabel
              obj={l}
              index={v}
              onPress={() => setChecked(v)}
              labelWrapStyle={{ marginHorizontal: 5 }}
              labelStyle={{ color: 'white' }}
            />
          </RadioButton>
        ))}
      </RadioForm>
    </View>
  
  return (
    <View style={AppStyle.topBar}>
        <View style={{ flexDirection: 'row' }}>
          <View style={AppStyle.homeButton}>
            <TouchableHighlight onPress={() => Alert.alert('Home button pressed')} underlayColor={Colours.PRIMARY}>
              <Ionicons name="home" size={25} color={'white'} />
            </TouchableHighlight>
          </View>
          <View style={AppStyle.searchBarContainer}>
            <Searchbar
              style={AppStyle.searchBar}
              placeholder="Search"
              onChangeText={setSearchQuery}
              value={searchQuery}
              onIconPress={onQuery}
            />
          </View>
        </View>
        {renderRadioForm}
      </View>
  )
}

export default TopBar;