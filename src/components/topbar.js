import { React, useState, } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Searchbar } from 'react-native-paper';
import Colours, { AppStyle } from "../styles";

const searchOptionList = [
  { label: 'Title', value: 0 },
  { label: 'Author', value: 1 },
  { label: 'Tags', value: 2 },
  { label: 'Location', value: 3 },
];

TopBar = ({ navigation, onSearch }) => {
  const [checked, setChecked] = useState('title');
  const [searchQuery, setSearchQuery] = useState('');

  const onQuery = () => {
    //props.navigation.navigate('Home');
    onSearch(searchQuery, checked);
    setSearchQuery('');
  }


  const renderRadioForm =
    <View style={AppStyle.radioButtonContainer}>
      <Text style={[AppStyle.radioMenuText, { flex: 2 }]}>Search by:</Text>
      <RadioForm
        formHorizontal={true}
        style={{ justifyContent: 'space-around', flex: 8 }}>
        {searchOptionList.map((option, i) => (
          <RadioButton key={i}>
            <RadioButtonInput
              obj={option}
              index={i}
              isSelected={checked === option.value}
              onPress={() => setChecked(option.value)}
              buttonSize={7}
              buttonInnerColor={'white'}
              buttonOuterColor={'white'}
            />
            <RadioButtonLabel
              obj={option}
              index={i}
              onPress={() => setChecked(option.value)}
              labelWrapStyle={{ marginHorizontal: 5 }}
              labelStyle={AppStyle.radioMenuText}
            />
          </RadioButton>
        ))}
      </RadioForm>
    </View>

  return (
    <View style={AppStyle.topBar}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => onSearch('', checked)} style={{ alignItems: 'center', paddingHorizontal: 10 }}>
          <Ionicons name="refresh" size={30} color={'white'} />
        </TouchableOpacity>
        <View style={AppStyle.searchBarContainer}>
          <Searchbar
            style={AppStyle.searchBar}
            placeholder="Search"
            onChangeText={setSearchQuery}
            value={searchQuery}
            onIconPress={onQuery}
            onSubmitEditing={onQuery}
          />
        </View>
      </View>
      {renderRadioForm}
    </View>
  )
}

let searchOptions = {}
for (const option of searchOptionList) {
  searchOptions[option.label] = option.value;
}
TopBar.searchOptions = searchOptions;

export default TopBar;