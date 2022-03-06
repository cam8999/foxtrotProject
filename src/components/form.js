import React from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import Colours from '../styles';


class Form extends React.Component {

  constructor(props) {
    super(props);
    this.state = {formItems:[]};
    // Fill formItems with Component counterparts to passed in fields.
    var item;
    for (const field of props.fields) {
      switch (field.type) {
        case 'text': {
          item = 
            <View>
              <Text>{field.prompt}</Text>
              <TextInput onChangeText={this.onChangeTextInput} style={{borderWidth:1}}/>
            </View>
          break;
        }

        case 'image-video-upload': {
          item = 
            <View>
              <Button
                title="Upload Images or Videos"
                onPress={this.handleImageVideoUpload}
                color={Colours.PRIMARY}
                accessibilityLabel="Click to upload images or videos"
              />
            </View>
          break;
        }

        case 'file-upload': {
          item = 
            <View>
              <Button
                title="Upload Other Files"
                onPress={this.handleDocumentUpload}
                color={Colours.PRIMARY}
                accessibilityLabel="Click to upload other files like PDFs"
              />
            </View>
          break;
        }

        case 'seperator': {
          item = <View></View> //TODO: Implement styling
        }

        default:
          item = null;
      }
      if (item) {
        this.state.formItems.push(item)
      }
    }
  }


  onChangeTextInput() {
    return null;
  }


  async handleImageVideoUpload() {
    var upload = await ImagePicker.launchImageLibraryAsync();
    console.log('Uploaded' + upload.name);
  }


  async handleDocumentUpload() {
    var upload = await DocumentPicker.getDocumentAsync();
    console.log('Uploaded' + upload.name);
  }


  render() {
    return (
      <ScrollView>
        {this.state.formItems}
      </ScrollView>
    )
  }
}

export default Form;