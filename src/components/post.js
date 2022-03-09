import React from 'react';
import { Dimensions, Image, View, Text, TouchableHighlight } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser } from '../firebase-config';
import Colours, { AppStyle } from '../styles';


class Post extends React.Component {

  static examplePosts = [
    {
      id: 10,
      UserUID: '43627846',
      title: "Climate Change in Bangladesh",
      author: 'H. Simpson',
      description: 'Research on the effects of Climate Change in Bangladesh.',
      location: 'Location B',
      coordinates: { latitude : 28.613939,  longitude : 77.209023 },
      tags: ['climate change', 'research'],
      textualData: [
        {prompt: 'How successful were the actions taken?', answer: 'Very'},
        {prompt: 'How was the success evaluated?', answer: 'Quantitive data gathering through questionaires.'},
        {prompt: 'Are there any other factors which could explain the success?', answer: 'Higher average precipitation the last few years. Less crop loss.'}
      ],
      hasFiles: false,
      media: [],
      documents: [],
      upvotes: 4,
      upvoters: [],
    },
    {
      id: 12,
      UserUID: '1421326',
      author: 'J. Frink',
      description: 'Study of average temperature increase in Asia.',
      location: 'Location A',
      coordinates: { latitude : 23.810331,  longitude : 90.412521 },
      tags: ['temperature', 'climate change'],
      textualData: [{prompt: 'Who could this benefit?', answer: 'Other indigenous peoples.'},],
      hasFiles: true,
      media: [{uri: 'https://i.imgur.com/b6BQJPc.jpeg', name:'people'},],
      documents: [],
      upvotes: 13,
      upvoters: [],
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      postUpvoted: true,
      upvotes: this.props.upvotes,
      renderSummary: this.props.summary,

      summaryImageURI: (this.props.media && this.props.media.length > 0) ? this.props.media[0].uri : null,
      mediaWidth: 0,
      mediaHeight: 0,
    }
    
    this.render = this.render.bind(this);
  }


  componentDidMount = () => {
    if (this.state.summaryImageURI) {
      Image.getSize(
        this.state.summaryImageURI,
        (w, h) => {
          const displayWidth = Dimensions.get('window').width;
          this.setState({ mediaWidth: displayWidth, mediaHeight: ((h * displayWidth) / w) });
        }
      )
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
    if (this.state.renderSummary) return (
      <View style={AppStyle.post}>
        <Text style={AppStyle.postHeader}>
          {this.props.author},
          <Text style={AppStyle.primary}> {this.props.location.name}</Text>
        </Text>
        {
          (this.props.media && this.props.media.length > 0) ?
            <Image
              style={{ 
                width: this.state.mediaWidth,
                height: this.state.mediaHeight, 
              }}
              source={{ uri: this.props.media[0].uri }}
            />
            : null
        }
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
      );
    else return (
      <View style={AppStyle.post}>
        <Text style={AppStyle.postHeader}>
          {this.props.author},
          <Text style={AppStyle.primary}> {this.props.location.name}</Text>
        </Text>
        {
          (this.props.media && this.props.media.length > 0) ?
            this.props.media.map(image => 
              <Image
                style={{ 
                  width: this.state.mediaWidth,
                  height: this.state.mediaHeight, 
                }}
                source={image.uri}
            />
            )
            : null
        }
        <Text style={AppStyle.postTags}>
          Tags: {this.props.tags.join(', ')}
        </Text>
        <Text style={AppStyle.postTail}>
          {this.props.description}
        </Text>
        {
          this.props.textualData.map(text =>
            <>
              <Text style={AppStyle.postTail}>{text.prompt} {text.answer}</Text>
            </>
          )
        }
        <Text style={AppStyle.postUpvoteBar}>
          <TouchableHighlight onPress={this.onUpvotePressed} underlayColor='white'>
            {this.state.postUpvoted ?
              <Ionicons name="heart" size={16} color={Colours.PRIMARY} />
              : <Ionicons name="heart-outline" size={16} color={Colours.PRIMARY} />}
          </TouchableHighlight>
          {''} {this.state.upvotes} upvotes
        </Text>
      </View>
    );
  }
}

export default Post;