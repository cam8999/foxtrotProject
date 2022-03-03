import {ColorPropType, StyleSheet} from 'react-native';

import * as Colours from './colours';

export const AppStyle = StyleSheet.create({
  primary: {
    color: Colours.PRIMARY,
  },
  post: {
    borderRadius: 15,
    overflow:'hidden',
    marginTop: 10,
    backgroundColor: 'white',
  },
  postHeader: {
    padding: 10,
    backgroundColor: 'white',
    fontWeight: 'bold',
  },
  postTags: {
    padding: 10,
    backgroundColor: '#E6E6E6',
    color: '#545454',
    fontStyle: 'italic',
  },
  postTail: {
    padding: 10,
    backgroundColor: 'white',
  },
  postUpvoteBar: {
    color: '#C0C0C0',
    padding: 10,
    paddingTop: 5,
  },
  profile: {
    overflow:'hidden',
    borderRadius: 15,
    marginTop: 10,
    width: '100%',
  },
  profileHeader: {
    padding: 10,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black'
  },
  profileComponent: {
    marginTop: 3,
    padding: 10,
    backgroundColor: 'white',
    color: '#C9C9C9',
  },
  profileDescription: {
    marginTop: 3,
    padding: 10,
    backgroundColor: '#E6E6E6',
    color: '#545454',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: Colours.PRIMARY,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 0,
    margin: 10,
  },
  buttonTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Colours;