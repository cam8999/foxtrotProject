import React from 'react';
import { Dimensions, Image, View, Text, TouchableHighlight } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser } from '../firebase-config';
import Colours, { AppStyle } from '../styles';


class Post extends React.Component {

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
    const displayWidth = Dimensions.get('window').width - 30;
    this.setState({ mediaWidth: displayWidth });
    if (this.state.summaryImageURI) {
      Image.getSize(
        this.state.summaryImageURI,
        (w, h) => {
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
      <View style={[AppStyle.post, {width: this.state.mediaWidth}]}>
        <Text style={AppStyle.postHeader}>
          {this.props.author}
          <Text style={AppStyle.primary}> {this.props.location}</Text>
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
          {this.props.author}
          <Text style={AppStyle.primary}> {this.props.location}</Text>
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