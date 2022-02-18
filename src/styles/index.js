import {StyleSheet} from 'react-native';

import * as Colours from './colours';

export const AppStyle = StyleSheet.create({
  primary: {
    color: Colours.PRIMARY,
  },
  post: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'black',
    overflow:'hidden',
    margin: 5,
  },
  postHeader: {
    padding: 5,
    backgroundColor: '#E0E0E0',
  },
  postTail: {
    padding: 5,
    backgroundColor: 'white',
  },
});

export default Colours;