import React from 'react';
import {Dimensions, Image, View, Text, FlatList, Button, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppStyle} from '../styles';
import Colours from '../styles'


class Post extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      mediaWidth: 0,
      mediaHeight: 0,
    }
  }

  componentDidMount() {
    if (this.props.mediaType == 'image') {
      Image.getSize(this.props.mediaSource, (w, h) => {
        const displayWidth = Dimensions.get('window').width
        this.setState({mediaWidth: displayWidth, mediaHeight: ((h * displayWidth) / w)})
      })
    }
  }

  render() {
    return (
      <View style={AppStyle.post}>
        <Text style={AppStyle.postHeader}>
          {this.props.author}, 
          <Text style={AppStyle.primary}> {this.props.location}</Text>
        </Text>
        {this.props.mediaType == 'image' ? 
         <Image
          style={{width: this.state.mediawidth, height: this.state.mediaHeight}} 
          source={{uri: this.props.mediaSource}} 
          /> 
        : null}
        <Text style={AppStyle.postTags}>
          Tags: {this.props.tags.join(", ")}
        </Text>
        <Text style={AppStyle.postTail}>
          {this.props.description}
        </Text>
        <Text style={AppStyle.postTail}> 
        <Ionicons name="heart" size={16} color={Colours.PRIMARY}/> {this.props.upvotes} upvotes
        </Text>
      </View>
    )
  }
}

const posts = [
  {
    key: 10,
    author: 'H. Simpson',
    description: 'Research on the effects of Climate Change in Bangladesh.',
    location: 'Location B',
    tags: ['Climate Change', 'Research'],
    mediaType: 'none',
    mediaSource: '',
    upvotes: 4,
  },
  {
    key: 12,
    author: 'J. Frink',
    description: 'Study of average temperature increase in Asia.',
    location: 'Location A',
    tags: ['Temperature', 'Climate Change'],
    mediaType: 'image',
    mediaSource: 'https://i.imgur.com/b6BQJPc.jpeg',
    upvotes: 12,
  },
]

const renderPost = ({item}) => {
  return (
    <Post 
    author={item.author} 
    description={item.description} 
    location={item.location}
    tags={item.tags}
    mediaType={item.mediaType}
    mediaSource={item.mediaSource} 
    upvotes={item.upvotes}
    />
  )
}

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
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.key}
        />
      </View>
      
    </View>
  );
}

export default HomeScreen;