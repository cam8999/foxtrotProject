
import { React, useState, useEffect } from 'react';
import { View, ScrollView, Text, FlatList, Pressable, TouchableOpacity, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getTopPosts, getPostsByTag, getPostsByLocation, getPostsByUsername, getPostsByTitle, getFilesForPost, uploadPostToDB, getPostsByCoordinates } from '../firebase-config';
import Post from '../components/post';
import TopBar from '../components/topbar';
import { AppStyle } from '../styles';


function HomeScreen({ route, navigation }) {
  const [posts, setPosts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [focusedPost, setFocusedPost] = useState();

  useEffect(() => {
    if (route.params) {
      setPosts([route.params.postsToDisplay]);
    }
    else filterPosts('', null);  // Fill posts with getTopPosts()
  }, [route.params]);

  const refreshPosts = () => {
    const backup = posts;
    setPosts(backup);
  }

  async function addFilesToPost(post) {
    const isImage = URI => URI.includes('.jpg') || URI.includes('.png') || URI.includes('.jpeg');
    if (post.hasFiles) {
      let URIs = await getFilesForPost(post.ID, post.userUID);
      let imageURIs = URIs.filter(URI => isImage(URI.toLowerCase()));
      let otherURIs = URIs.filter(URI => !isImage(URI.toLowerCase()));
      post.media = [];
      post.documents = [];
      imageURIs.forEach(URI => post.media.push({uri: URI}));
      otherURIs.forEach(URI => post.documents.push({uri: URI}));
    }
    return post;
  }

  async function filterPosts(query, queryType) {
    let promise;
    console.log(TopBar.searchOptions);
    if (query == '' || queryType == null) promise = getTopPosts();
    else {
      switch (queryType) {
        case TopBar.searchOptions.Tags:
          promise = getPostsByTag(query);
          break;
        case TopBar.searchOptions.Location:
          promise = getPostsByLocation(query);
          break;
        case TopBar.searchOptions.Author:
          promise = getPostsByUsername(query);
          break;
        case TopBar.searchOptions.Title:
          promise = getPostsByTitle(query);
          break;
        default:
          console.error('filterPosts - Invalid queryType' + queryType);
          return;
      }
    }
    let downloadedPosts = await promise;
    if (downloadedPosts) {
      downloadedPosts.forEach((post, index) => post.id = index);
      setPosts(downloadedPosts);
      Promise.all(downloadedPosts.map(post => addFilesToPost(post))).then(ps => setPosts(ps));
      refreshPosts();
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