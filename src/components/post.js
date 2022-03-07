import React from 'react';
import { Dimensions, Image, View, Text, TouchableHighlight } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Colours, { AppStyle } from '../styles';


class Post extends React.Component {

  static examplePosts = [
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
  ];

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


  static renderPostFromItem = ({ item }) => {
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

export default Post;