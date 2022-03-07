import { React, useState } from 'react';
import { View, Text, FlatList } from 'react-native';


import { getUser, getTopPosts, getPostsByUserUID, getPostsByLocation, getPostsByUsername, getPostsByTitle } from '../firebase-config';
import Post from '../components/post';
import TopBar from '../components/topbar';
import { AppStyle } from '../styles';


async function Test() {
  let user1 = await getUser();
  let posts = await getPostsByUserUID('John', 10, false);
  //uploadPostToDB({ 'TT': 'TT' }, user1);
  console.log(posts);
}

const filterPosts = (query, queryType) => {
  if (query == "") setQueryPosts(posts);
  else {
    switch (queryType) {
      case 'Tags':
        setQueryPosts(getPostsByTag(query));
      case 'Location':
        setQueryPosts(getPostsByLocation(query));
      case 'Username':
        setQueryPosts(getPostsByUsername(query));
      case 'Title':  // Default to title
      default:
        setQueryPosts(getPostsByTitle(query));
    }
  }
  return posts.filter((post) => {
    const postName = post.description.toLowerCase();
    return postName.includes(query);
  });
};

function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [queryPosts, setQueryPosts] = useState([]);

  return (
    <View style={AppStyle.homeContainer}>
      <TopBar
        navigation={navigation}
        onSearch={filterPosts}
      />
      <View style={AppStyle.postsContainer}>
        <Text>{queryPosts.length == 0 ? "No results" : ""}</Text>
        <FlatList
          data={queryPosts}
          renderItem={Post.examplePosts}
          keyExtractor={(item) => item.key}
        />
      </View>
    </View>
  );
}


export default HomeScreen;