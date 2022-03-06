import React, { useRef, useEffect, Component } from 'react';
import { Dimensions, Image, View, Text, FlatList, Button, Alert, WebView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AppStyle } from '../styles';
import Colours from '../styles'
import { TouchableHighlight } from 'react-native-gesture-handler';
import { getUser, uploadPostToDB, deletePost, getPostsByLocation, getPostsByTag, getPostsByUsername } from '../firebase-config';

import { Searchbar } from 'react-native-paper';

import { Button as Button2, Menu, Divider, Provider } from 'react-native-paper';
import { RadioButton } from 'react-native-paper';



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
  let posts = await getPostsByUsername('John', 10, true);
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
function HomeScreen({ navigation }) {


  const [searchQuery, setSearchQuery] = React.useState('');
  const onChangeSearch = query => setSearchQuery(query);
  const [checked, setChecked] = React.useState('gen');




  function filt() {


    qposts = filterPosts(posts, searchQuery.toLowerCase());

    onChangeSearch("");



  }



  return (


    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#C0C0C0' }}>

      <View style={{ height: 50, width: '100%', backgroundColor: Colours.PRIMARY }}>

        <View style={{ width: "20%", flexDirection: "row" }}>
          <RadioButton.Item
            value="general"
            label="General"
            status={checked === 'gen' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('gen')}
          />
          <RadioButton.Item
            label="Type"
            value="type"
            status={checked === 'type' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('type')}
          />

          <RadioButton.Item

            color='black'
            value="Title"
            label="Title"
            status={checked === 'title' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('title')}
          />
          <RadioButton.Item
            label="Location"
            value="location"
            status={checked === 'loc' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('loc')}
          />
        </View>

      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: '100%', backgroundColor: Colours.PRIMARY, flexDirection: "row" }}>


        <Searchbar

          placeholder="Search"
          onChangeText={onChangeSearch}
          value={searchQuery}
        />


        <Button
          icon={<Ionicons name='home' color='red' size='15' />}
          title='Search'
          onPress={() => { filt() }}
        />

      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', height: 50, width: '100%', backgroundColor: Colours.PRIMARY }}>


        <Button
          icon={<Ionicons name='home' color='red' size='15' />}
          title='home'
          onPress={() => Alert.alert('Home button pressed')}
        />
      </View>

      <View style={{ justifyContent: 'center', alignItems: 'center', height: 20, width: '100%' }}>


        <Text>{qposts.length == 0 ? "No results" : ""}</Text>
      </View>


      <View style={{ justifyContent: 'center', flex: 1, width: '100%' }}>

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