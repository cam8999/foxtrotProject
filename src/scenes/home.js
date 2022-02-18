import React from 'react';
import {View, Text, FlatList, Button, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppStyle} from '../styles';
import Colours from '../styles'


class Post {
  key;
  title;
  author;
  description;

  constructor(key, title, author, description) {
    this.key = key;
    this.title = title;
    this.author = author;
    this.description = description;
  }

  renderPost() {
    return (
      <View style={AppStyle.post}>
        <Text style={AppStyle.postHeader}>
          '{this.title}' by {this.author}
        </Text>
        <Text style={AppStyle.postTail}>
          {this.description}
        </Text>
      </View>
      
    )
  }
}

const p1 = new Post(10, 'Effects of Climate Change', 'H. Simpson', 'Research on the effects of Climate Change in Bangladesh.');
const p2 = new Post(12, 'Global Warming', 'J. Frink', 'Study of average temperature increase in Asia.');

// TODO: Move styling to styles.js
// TODO: Add navigator for home button and top navigation bar.
// TODO: Replace home button with TouchableHighlight and Icon
function HomeScreen({navigation}) {
  return (
    <View style={{ flex:1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor:'#C0C0C0' }}>
      <View style={{justifyContent: 'center', alignItems: 'center', height:80, width: '100%', backgroundColor:Colours.PRIMARY}}>
        <Button
          icon={<Ionicons name='home' color='red' size='15'/>}
          title='home'
          onPress={() => Alert.alert('Home button pressed')}
        />
      </View>
      <View style={{flex:1, width: '100%'}}>
        <FlatList
          data={[
            p1, p2
          ]}
          renderItem={({item}) => item.renderPost()}
        />
      </View>
      
    </View>
  );
}

export default HomeScreen;