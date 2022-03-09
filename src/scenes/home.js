
import { React, useState, useEffect } from 'react';
import { View, ScrollView, Text, FlatList, Pressable, TouchableOpacity, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser, getTopPosts, getPostsByTag, getPostsByLocation, getPostsByUsername, getPostsByTitle, getFilesForPost, uploadPostToDB } from '../firebase-config';
import Post from '../components/post';
import TopBar from '../components/topbar';
import { AppStyle } from '../styles';


function HomeScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [focusedPost, setFocusedPost] = useState();

  useEffect(() => {
    console.log(route);
    if (route.params) {
      setPosts([route.params.postsToDisplay]);
    }
    else filterPosts('', null);  // Fill posts with getTopPosts()
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
    console.log('filterPosts - Downloading Posts');
    console.log('filterPosts - Query type: ' + queryType);
    if (query == '' || queryType == null) promise = getTopPosts();
    else {
      switch (queryType) {
        case 2:
          promise = getPostsByTag(query);
        case 3:
          promise = getPostsByLocation(query);
        case 1:
          promise = getPostsByUsername(query);
        case 0:
          promise = getPostsByTitle(query);
          break;
        default:
          console.error('filterPosts - Invalid queryType' + queryType);
          return;
      }
    }
    console.log('filterPosts - Awaiting Posts');
    let downloadedPosts = await promise;
    console.log('filterPosts - Downloaded Posts');
    if (downloadedPosts) {
      downloadedPosts.forEach((post, index) => post.id = index);
      setPosts(downloadedPosts);
      console.log(downloadedPosts[0]);
      dPromise.all(downloadedPosts.map(post => addFilesToPost(post))).then(ps => setPosts(ps));
      console.log('filterPosts - Downloaded Images for Posts');
    }
    
  }

  const renderPostAsButton = (item) =>
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
      <View style={[AppStyle.postsContainer, {flex: 1}]}>
        {posts.length == 0 ? 
          <View style={AppStyle.bubble}>
            <Text style={AppStyle.lightText}>No Posts</Text>  
          </View>
        : null }
        <FlatList
          data={posts}
          renderItem={({item}) => renderPostAsButton(item)}
          keyExtractor={item => item.id}
          ListFooterComponent={<View style={{height:15}}></View>}
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
      <ScrollView contentContainerStyle={AppStyle.postsContainer}>
        <Post {...post} summary={false} />
        <View style={{height: 15}}/>
      </ScrollView>
    </View>

  return focused ? renderFocusedPost(focusedPost) : renderFeed();
}

export default HomeScreen;