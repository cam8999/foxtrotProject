import { React, useState } from 'react';
import { View, Text, TouchableHighlight} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { Searchbar } from 'react-native-paper';

import Colours, { AppStyle } from "../styles";


const searchOptionList = [
  { label: 'General', value: 'gen', },
  { label: 'Type', value: 'type', },
  { label: 'Title', value: 'title', },
  { label: 'Location', value: 'loc', },
];

TopBar = (navigation, onSearch) => {
  const [checked, setChecked] = useState('Title');
  const [searchQuery, setSearchQuery] = useState('');
  
  onSearch = () => {
    //props.navigation.navigate('Home');
    props.onSearch(searchQuery, checked);
    setSearchQuery('');
  }

  
  return (
    <View style={AppStyle.topBar}>
      {/* Post button */}
      <View style={{flexDirection: 'row'}}>
        <View style={AppStyle.homeButton}>
          <TouchableHighlight 
            //props.navigation.navigate('Home')}
            underlayColor={Colours.PRIMARY}
          >
            <Ionicons name="home" size={25} color={'white'} />
          </TouchableHighlight>
        </View>
        <View style={AppStyle.searchBarContainer}>
          <Searchbar
            style={AppStyle.searchBar}
            placeholder="Search"
            onChangeText={text => setSearchQuery(text)}
            value={searchQuery}
            onIconPress={onSearch}
          />
        </View>
      </View>
      <View style={AppStyle.radioButtonContainer}>
        <Text style={AppStyle.textInput}>Search by:</Text>
        <RadioForm 
          formHorizontal={true}
          style={{ justifyContent: 'space-around', flex: 9 }}
        >
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
    </View>
  )
}

export default TopBar;