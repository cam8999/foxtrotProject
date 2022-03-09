
import { React, useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, TouchableOpacity, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser, getTopPosts, getPostsByLocation, getPostsByUsername, getPostsByTitle, getFilesForPost, uploadPostToDB } from '../firebase-config';
import Post from '../components/post';
import TopBar from '../components/topbar';
import { AppStyle } from '../styles';


async function Test() {
  let user1 = await getUser();
  let posts = await uploadPostToDB({ 'latitude': 10.03, 'longitude': 10.03 }, { 'uid': '2Lt2CzPtbfO5Bt1ANmvwVbSB5o53' });
  //uploadPostToDB({ 'TT': 'TT' }, user1);
  console.log(posts);
}


function HomeScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [focusedPost, setFocusedPost] = useState();

  useEffect(() => {
    console.log(route);
    if (route.params) setPosts([route.params.postsToDisplay])
    //else filterPosts('', null);  // Fill posts with getTopPosts()
  }, [route.params]);

  async function addFilesToPost(post) {
    const isImage = URI => URI.endswith('.jpg') || URI.endswith('.png') || URI.endswith('.jpeg');
    if (post.hasFiles) {
      let URIs = await getFilesForPost(post, post.UserUID);
      let imageURIs = URIs.items.filter(URI => isImage(URI.toLowerCase()));
      let otherURIs = URIs.items.filter(URI => !isImage(URI.toLowerCase()));
      post.media = imageURIs.map(URI => { uri: URI });
      post.documents = otherURIs.map(URI => { uri: URI });
    }
    return post;
  }

  async function filterPosts(query, queryType) {
    let promise;
    if (query == '') promise = getTopPosts();
    else {
      switch (queryType) {
        case 'Tags':
          promise = getPostsByTag(query);
        case 'Location':
          promise = getPostsByLocation(query);
        case 'Username':
          promise = getPostsByUsername(query);
        case 'Title':  // Default to title
        default:
          promise = getPostsByTitle(query);
      }
    }
    let downloadedPosts = await promise;
    Promise.all(downloadedPosts.map(post => addFilesToPost(post))).then(ps => setPosts(ps));
    console.log(posts);
  }

  const renderPostAsButton = item =>
    <Pressable
      onPress={() => { setFocusedPost(item); setFocused(true) }}
    >
      <Post {...item} summary={true} />
    </Pressable>

  const renderFeed = () =>
    <View style={AppStyle.homeContainer}>
      <TopBar
        navigation={navigation}
        onSearch={filterPosts}
      />
      <View style={AppStyle.postsContainer}>
        {posts.length == 0 ? 
          <View style={AppStyle.bubble}>
            <Text style={AppStyle.lightText}>No Posts</Text>  
          </View>
        : null }
        <FlatList
          data={posts}
          renderItem={({ item }) => renderPostAsButton(item)}
          keyExtractor={item => item.id}
        />
      </View>
    </View>

  const renderFocusedPost = (post) =>
    <View style={AppStyle.homeContainer}>
      <View style={AppStyle.topBar}>
        <View style={{ marginLeft: 15 }}>
          <TouchableOpacity onPress={() => setFocused(false)}>
            <Ionicons name="arrow-back" size={30} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ ...AppStyle.postsContainer, height: '100%' }}>
        <Post {...post} summary={false} />
      </View>
    </View>

  return focused ? renderFocusedPost(focusedPost) : renderFeed();
}

export default HomeScreen;