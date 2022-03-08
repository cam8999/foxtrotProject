
import { React, useState, useEffect} from 'react';
import { View, Text, FlatList, Pressable, Button } from 'react-native';


import { getUser, getTopPosts, getPostsByLocation, getPostsByUsername, getPostsByTitle, getFilesForPost } from '../firebase-config';
import Post from '../components/post';
import TopBar from '../components/topbar';
import { AppStyle } from '../styles';


async function Test() {
  let user1 = await getUser();
  let posts = await getPostsByCoordinates({ 'latitude': 10.03, 'longitude': 10.03 }, 10, false);
  //uploadPostToDB({ 'TT': 'TT' }, user1);
  console.log(posts);
}


function HomeScreen({route, navigation }) {
  const [posts, setPosts] = useState([]);
  const [focused, setFocused] = useState(false);
  const [focusedPost, setFocusedPost] = useState();

  useEffect(() => {
    if (route.postsToDisplay) setPosts(route.postsToDisplay)
    else filterPosts('', null);  // Fill posts with getTopPosts()
  }, []);

  async function addFilesToPost(post) {
    const isImage = URI => URI.endswith('.jpg') || URI.endswith('.png') || URI.endswith('.jpeg');
    if (post.hasFiles) {
      let URIs = await getFilesForPost(post, post.UserUID);
      let imageURIs = URIs.items.filter(URI => isImage(URI.toLowerCase()));
      let otherURIs = URIs.items.filter(URI => !isImage(URI.toLowerCase()));
      post.media = imageURIs.map(URI => {uri: URI});
      post.documents = otherURIs.map(URI => {uri: URI});
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
      onPress={() => {setFocusedPost(item); setFocused(true)}}
    >
      <Post {...item} summary={true}/>
    </Pressable>

  const renderFeed = () => 
    <View style={AppStyle.homeContainer}>
      <TopBar
        navigation={navigation}
        onSearch={filterPosts}
      />
      <View style={AppStyle.postsContainer}>
        <Text>{posts.length == 0 ? "No results" : ""}</Text>
        <FlatList
          data={Post.examplePosts}
          renderItem={({item}) => renderPostAsButton(item)}
          keyExtractor={item => item.id}
        />
      </View>
    </View>

  const renderFocusedPost = (post) =>
    <View style={AppStyle.homeContainer}>
      <View style={AppStyle.topBar}>
        <Button
          title="Back"
          onPress={() => setFocused(false)}
        />
      </View>
      <View style={{...AppStyle.postsContainer, height:'100%'}}>
        <Post {...post} summary={false}/>
      </View>
    </View>

  return focused ? renderFocusedPost(focusedPost) : renderFeed();
}

export default HomeScreen;