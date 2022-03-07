import React from 'react';
import {View, Text, TextInput, Button, Image} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import FastImage from 'react-native-fast-image';
import * as Location from 'expo-location';
import { RadioButton } from 'react-native-paper';

import Colours, {FormStyle} from '../styles';



class LinearForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      galleryUploads: [],  // List of uploaded picture and video objects
      documentUploads: [],  // List of uploaded documents of types specified in props.documentUploadTypes
      haveMediaLibraryPermission: false,  // Permission to access photo library needed for ImagePicker
      canRequestMediaLibraryAccess: true,  // Can we prompt user again for access to photo library

      locationMethod: 'gps',  // The currently selected method of location acquisition out of 'gps', 'address' and 'latlong'
      location: {latitude: 0, longitude: 0},
      enteredAddress: "",
      geolocationAccuracy: Location.Accuracy.Balanced,  // Accuracy to lookup location to. See https://docs.expo.dev/versions/latest/sdk/location/#accuracy
      locating: false,
    };

    // Make state accessible through this from all functions
    this.renderFieldsIntoComponents = this.renderFieldsIntoComponents.bind(this);
    this.ensureMediaLibraryAccess = this.ensureMediaLibraryAccess.bind(this);
    this.handleGalleryUpload = this.handleGalleryUpload.bind(this);
    this.handleDocumentUpload = this.handleDocumentUpload.bind(this);
    this.getLocationMethodComponent = this.getLocationMethodComponent.bind(this);
    this.locateDevice = this.locateDevice.bind(this);
    this.lookupAddress = this.lookupAddress.bind(this);
    this.render = this.render.bind(this);
  }


  renderFieldsIntoComponents() {
    const formComponents = [];
    let counter = 0;
    for (const field of this.props.fields) {
      switch (field.type) {
        case 'text': {
          item = 
            <View key={counter}>
              <Text>{field.prompt}</Text>
              <TextInput onChangeText={this.onChangeTextInput} style={{borderWidth:1}}/>
            </View>
          break;
        }

        case 'gallery-upload': {
          item = 
            <View key={counter}>
              <Button
                title="Upload Images or Videos"
                onPress={this.handleGalleryUpload}
                //disabled={this.state.canRequestMediaLibraryAccess || this.state.haveMediaLibraryPermission}
                color={Colours.PRIMARY}
                accessibilityLabel="Click to upload images or videos"
              />
              <View style={FormStyle.mediaPreview}>
                {this.state.galleryUploads.map(upload => <Image style={FormStyle.uploadedImage} source={{uri: upload.uri}}/>)}
              </View>
            </View>
          break;
        }

        case 'document-upload': {
          item =
            <View key={counter}>
              <Button
                title="Upload Other Files"
                onPress={this.handleDocumentUpload}
                color={Colours.PRIMARY}
                accessibilityLabel="Click to upload other files like PDFs"
              />
              <View style={FormStyle.mediaPreview}>
                {this.state.documentUploads.map(upload => <Text>{upload.name}</Text>)}
              </View>
            </View>
          break;
        }

        case 'location': {
          item = 
            <View key={counter}>
              <Text>GPS</Text>
              <RadioButton
                value="GPS"
                status={ this.state.chosenMethodComponent === 'gps' ? 'checked' : 'unchecked' }
                onPress={() => this.setState({chosenMethodComponent: 'gps'})}
              />
              <Text>Address Lookup</Text>
              <RadioButton
                value="Address Lookup"
                status={ this.state.chosenMethodComponent === 'address' ? 'checked' : 'unchecked' }
                onPress={() => this.setState({chosenMethodComponent: 'address'})}
              />
              <Text>Latitude-Longitude</Text>
              <RadioButton
                value="Latitude-Longitude"
                status={ this.state.chosenMethodComponent === 'latlong' ? 'checked' : 'unchecked' }
                onPress={() => this.setState({chosenMethodComponent: 'latlong'})}
              />
              {this.getLocationMethodComponent(this.state.chosenMethodComponent)}
              <Text>Latitude: {this.state.location.latitude} Longitude: {this.state.location.longitude}</Text>
            </View>
          break;
        }

        case 'heading': {
          item = 
            <View key={counter}>
              <Text style={FormStyle.heading}>{field.text}</Text>
            </View>
          break;
        }

        case 'sub-heading': {
          item = 
            <View key={counter}>
              <Text style={FormStyle.subheading}>{field.text}</Text>
            </View>
          break;
        }

        case 'seperator': {
          item = <View key={counter}></View> //TODO: Implement styling
        }

        default:
          item = null;
      }
      if (item) {
        counter += 1;
        formComponents.push(item)
      }
    }
    return formComponents;
  }


  onChangeTextInput() {
    return null;
  }


  async ensureMediaLibraryAccess() {
    if (this.state.haveMediaLibraryPermission) return true;
    if (!this.state.canRequestMediaLibraryAccess) return false;
    // Invariant: Will always run rest of function from initial state configuration
    let currentPermissions = await ImagePicker.getMediaLibraryPermissionsAsync();
    this.state.haveMediaLibraryPermission = currentPermissions.granted;
    this.state.canRequestMediaLibraryAccess = currentPermissions.canAskAgain;
    if (currentPermissions.canAskAgain && !currentPermissions.granted) {
      let newPermissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
      this.state.haveMediaLibraryPermission = newPermissions.granted;
      this.state.canRequestMediaLibraryAccess = newPermissions.canAskAgain;
    }
    return this.state.haveMediaLibraryPermission;
  }


  async handleGalleryUpload() {
    if (!this.ensureMediaLibraryAccess()) {
      console.log("Need media library access permissions to upload image.");
      return;
    }
    let upload = await ImagePicker.launchImageLibraryAsync({allowsEditing: true});
    if (!upload.cancelled) {
      let image = {
        uri: upload.uri,
        name: upload.uri.substring(upload.uri.lastIndexOf('/')+1),
      }
      this.setState(state => {
        const galleryUploads = state.galleryUploads.push(image);
        return galleryUploads;
      })
      console.log("Uploaded image " + image.name);
    }
  }


  async handleDocumentUpload() {
    let pickerOptions = {};
    if (this.props.documentUploadTypes) pickerOptions.type = this.props.documentUploadTypes;
    var upload = await DocumentPicker.getDocumentAsync({type: this.props.documentUploadTypes});
    if (upload.type == 'success') {
      let image = {
        uri: upload.uri,
        name: upload.uri.substring(upload.uri.lastIndexOf('/')+1),
        type: upload.uri.substring(upload.uri.lastIndexOf('.')),
      }
      this.setState(state => {
        const documentUploads = state.documentUploads.push(image);
        return documentUploads;
      })
      console.log("Uploaded document " + image.name);
    }
  }


  getLocationMethodComponent(method) {
    let chosenMethodComponent;
      switch(method) {
        case 'gps': {
          if (this.state.locating) {
            chosenMethodComponent = 
              <Button
                title="Locating..."
                disabled={true}
                color={Colours.PRIMARY}
              />
          } else {
            chosenMethodComponent = 
              <Button
                title="Locate Me"
                onPress={this.locateDevice}
                color={Colours.PRIMARY}
                accessibilityLabel="Click to locate this device using GPS"
              />
          }
          
          break;
        }
        case 'address': {
          if (this.state.locating) {
            chosenMethodComponent = 
            <>
              <TextInput
                placeholder="Address"
                autoComplete='postal-address'
                onChangeText={addr => this.setState({enteredAddress: addr})}
              />
              <Button
                title="Looking Up..."
                disabled={true}
                color={Colours.PRIMARY}
              />
            </>
          } else {
            chosenMethodComponent = 
            <>
              <TextInput
                placeholder="Address"
                autoComplete='postal-address'
                onChangeText={addr => this.setState({enteredAddress: addr})}
              />
              <Button
                title="Lookup"
                onPress={this.lookupAddress}
                color={Colours.PRIMARY}
                accessibilityLabel="Click to lookup the entered address"
              />
            </>
          }
          break;
        }
        case 'latlong': {
          chosenMethodComponent = 
            <>
              <TextInput
                placeholder="Latitude"
                onChangeText={lat => this.setState({location: {latitude: lat, longitude: this.state.location.longitude}})}
              />
              <TextInput
                placeholder="Longitude"
                onChangeText={long => this.setState({location: {latitude: this.state.location.latitude, longitude: long}})}
              />
            </>
          break;
        }
    }
    return chosenMethodComponent;
  }


  async locateDevice() {
    let currPermission = await Location.requestForegroundPermissionsAsync();
    if (currPermission.granted) {
      this.setState({locating: true});
      let currLocation = await Location.getCurrentPositionAsync({accuracy: this.state.geolocationAccuracy});
      this.setState({location: {latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude}});
      this.setState({locating: false});
    }
  }


  async lookupAddress() {
    let currPermission = await Location.requestForegroundPermissionsAsync();
    if (currPermission.granted) {
      this.setState({locating: true});
      let locations = await Location.geocodeAsync(this.state.enteredAddress, {accuracy: this.state.geolocationAccuracy});
      if (locations.length > 0) {
        this.setState({location: {latitude: locations[0].latitude, longitude: locations[0].longitude}});
        this.setState({locating: false});
      }
    }
  }


  render() {
    return (
      <View style={FormStyle.container}>
        <ScrollView>
          {this.renderFieldsIntoComponents()}
        </ScrollView>
      </View>
    )
  }
}

export default LinearForm;