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
});

export default Colours;