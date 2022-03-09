import { get } from 'firebase/database';
import React from 'react';
import { Dimensions, Image, View, Text, TouchableHighlight, Alert } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser, togglePostUpvote, deletePost } from '../firebase-config';
import Colours, { AppStyle } from '../styles';


class Post extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      postUpvoted: false,
      upvotes: this.props.Upvotes,
      renderSummary: this.props.summary,
      currentUser: null,

      summaryImageURI: (this.props.media && this.props.media.length > 0) ? this.props.media[0].uri : null,
      mediaWidth: 0,
      mediaHeight: 0,
    }
    if (this.props.media) this.props.media.forEach((item, index) => item.key = index);
    this.determineIfUpvoted.bind(this)();
    this.render = this.render.bind(this);
  }


  async determineIfUpvoted() {
    let user = await getUser();
    console.log(user);
    this.setState({postUpvoted: this.props.Upvoters.includes(user.uid), currentUser: user}); 
  }

  onDeletePressed = () => {
    deletePost(this.props.ID, this.state.currentUser);
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
      if (this.state.postUpvoted) this.setState({ postUpvoted: false, upvotes: this.state.upvotes - 1 });
      else this.setState({ postUpvoted: true, upvotes: this.state.upvotes + 1 });
      getUser().then(user => togglePostUpvote(this.props.ID, user));
  }

  render() {
    console.log(this.props.media);
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
        <View style={AppStyle.postUpvoteBar}>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight onPress={this.onUpvotePressed} underlayColor='white'>
              {this.state.postUpvoted ?
                <Ionicons name="heart" size={16} color={Colours.PRIMARY} />
                : <Ionicons name="heart-outline" size={16} color={Colours.PRIMARY} />}
            </TouchableHighlight>
            <Text style={{color: '#C0C0C0'}}>{''} {this.state.upvotes} upvotes</Text>
          </View>
          {this.props.displayDelete ?
            <TouchableHighlight underlayColor='white' onPress={this.onDeletePressed}>
              <Ionicons name="trash" size={16} color={Colours.PRIMARY} />
            </TouchableHighlight>
          : null}
        </View>
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
            this.props.media.map((image, index) => 
              <Image
                style={{ 
                  width: this.state.mediaWidth,
                  height: this.state.mediaHeight, 
                }}
                source={{uri: image.uri}}
                key={index}
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
          this.props.textualData.map((text, index) =>
            <Text style={AppStyle.postTail} key={index}>{text.prompt} {text.answer}</Text>
          )
        }
        <View style={AppStyle.postUpvoteBar}>
          <View style={{flexDirection: 'row'}}>
            <TouchableHighlight onPress={this.onUpvotePressed} underlayColor='white'>
              {this.state.postUpvoted ?
                <Ionicons name="heart" size={16} color={Colours.PRIMARY} />
                : <Ionicons name="heart-outline" size={16} color={Colours.PRIMARY} />}
            </TouchableHighlight>
            <Text style={{color: '#C0C0C0'}}>{''} {this.state.upvotes} upvotes</Text>
          </View>
          {this.props.displayDelete ?
            <TouchableHighlight underlayColor='white' onPress={this.onDeletePressed}>
              <Ionicons name="trash" size={16} color={Colours.PRIMARY} />
            </TouchableHighlight>
          : null}
        </View>
      </View>
    );
  }
}

export default Post;