import React, { useRef, useEffect, Component } from 'react';
import { Dimensions, Image, View, Text, FlatList, Button, Alert, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppStyle } from '../styles';
import Colours from '../styles'
import { TouchableHighlight } from 'react-native';

import { getUser, uploadPostToDB, deletePost, getPostsByLocation, getPostsByTag, getPostsByUsername, getPostsByUserUID, getPostsByCoordinates } from '../firebase-config';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import { Searchbar } from 'react-native-paper';

import { Button as Button2, Menu, Divider, Provider } from 'react-native-paper';
import { color } from 'react-native-elements/dist/helpers';



class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mediaWidth: 0,
      mediaHeight: 0,
      postUpvoted: this.props.postUpvoted,
      upvotes: this.props.upvotes,
    }
  }

  componentDidMount() {
    if (this.props.mediaType == 'image') {
      Image.getSize(this.props.mediaSource, (w, h) => {
        const displayWidth = Dimensions.get('window').width
        this.setState({ mediaWidth: displayWidth, mediaHeight: ((h * displayWidth) / w) })
      })
    }
  }

  onUpvotePressed = () => {
    {
      this.state.postUpvoted ?
        this.setState({ postUpvoted: false, upvotes: this.state.upvotes - 1 })
        : this.setState({ postUpvoted: true, upvotes: this.state.upvotes + 1 })
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
            style={{ width: this.state.mediawidth, height: this.state.mediaHeight }}
            source={{ uri: this.props.mediaSource }}
          />
          : null}
        <Text style={AppStyle.postTags}>
          Tags: {this.props.tags.join(', ')}
        </Text>
        <Text style={AppStyle.postTail}>
          {this.props.description}
        </Text>
        <Text style={AppStyle.postUpvoteBar}>
          <TouchableHighlight onPress={this.onUpvotePressed} underlayColor='white'>
            {this.state.postUpvoted ?
              <Ionicons name="heart" size={16} color={Colours.PRIMARY} />
              : <Ionicons name="heart-outline" size={16} color={Colours.PRIMARY} />}
          </TouchableHighlight>
          {''} {this.state.upvotes} upvotes
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
    postUpvoted: true,
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
    postUpvoted: false,
  },
]

const renderPost = ({ item }) => {
  return (
    <Post
      author={item.author}
      description={item.description}
      location={item.location}
      tags={item.tags}
      mediaType={item.mediaType}
      mediaSource={item.mediaSource}
      upvotes={item.upvotes}
      postUpvoted={item.postUpvoted}
    />
  )
}

async function Test() {
  let user1 = await getUser();
  let posts = await getPostsByCoordinates({ 'latitude': 10.03, 'longitude': 10.03 }, 10, false);
  //uploadPostToDB({ 'TT': 'TT' }, user1);
  console.log(posts);
}

const filterPosts = (posts, query) => {
  if (!query) {
    return posts;
  }

  return posts.filter((post) => {
    const postName = post.description.toLowerCase();
    return postName.includes(query);
  });
};
var qposts = posts


// TODO: Move styling to styles.js
// TODO: Add navigator for home button and top navigation bar.
// TODO: Replace home button with TouchableHighlight and Icon

const searchOptionList = [
  { label: 'General', value: 'gen', },
  { label: 'Type', value: 'type', },
  { label: 'Title', value: 'title', },
  { label: 'Location', value: 'loc', },
];

function HomeScreen({ navigation }) {

  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [checked, setChecked] = React.useState('gen');




  function filt() {


    qposts = filterPosts(posts, searchQuery.toLowerCase());

    onChangeSearch("");



  }

  //Test();
  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#C0C0C0' }}>
      <View style={AppStyle.topBar}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableHighlight onPress={() => Alert.alert('Home button pressed')} underlayColor={Colours.PRIMARY}>
              <Ionicons name="home" size={25} color={'white'} />
            </TouchableHighlight>
          </View>
          <View style={{ flex: 10 }}>
            <Searchbar
              style={AppStyle.searchBar}
              placeholder="Search"
              onChangeText={onChangeSearch}
              value={searchQuery}
              onIconPress={() => { filt() }}
            />
          </View>
        </View>
        <View style={{ paddingTop: 10, paddingLeft: 10, flexDirection: 'row' }}>
          <Text style={{ color: 'white', flex: 2 }}>Search by:</Text>
          <RadioForm formHorizontal={true} style={{ justifyContent: 'space-around', flex: 9 }}>
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
      <View style={{ justifyContent: 'center', flex: 1, width: '100%' }}>
        <Text>{qposts.length == 0 ? "No results" : ""}</Text>
        <FlatList
          data={qposts}
          renderItem={renderPost}
          keyExtractor={(item) => item.key}
        />
      </View>
    </View>
  );
}


export default HomeScreen;