import React from 'react';
import { View, Text, TextInput, Button, Image, Pressable, Divider } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import FastImage from 'react-native-fast-image';
import * as Location from 'expo-location';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';

import Colours from '../styles';

// TODO: Data sanitisation/necessitation
// TODO: Maximum uploads = 10
// TODO: Add optional personal info
// TODO: Stylise

/*
 * A form component containing provided fields in a linear column.
 * @param fields - A list of fields of type LinearForm.FieldTypes to construct the form from.
 * @param documentUploadTypes - A list of MIME types which can be uploaded in the form.
 * @param onSubmit {JSON => bool} - A function called with the form data on submit. Must return success value.
 * @param stylesheet - A stylesheet the form should use.
 */
class LinearForm extends React.Component {

  // An enum of all supported field types.
  static FieldTypes = {
    Text: 'text',  // text: "text to display"
    Question: 'question',  // prompt: "text to display" 
    GalleryUpload: 'gallery-upload',
    DocumentUpload: 'document-upload',
    Location: 'location',
    Heading: 'heading',  // text: "text to display"
    Subheading: 'sub-heading', // text: "text to display"
    Seperator: 'seperator',
  }

  constructor(props) {
    super(props);
    this.state = {
      fields: this.props.fields,
      textInputs: new Map(),  // A map of prompts to corresponding text input
      onSubmit: this.props.onSubmit,  // Function to return form JSON ddata to

      galleryUploads: [],  // List of uploaded picture and video objects
      documentUploads: [],  // List of uploaded documents of types specified in props.documentUploadTypes
      haveMediaLibraryPermission: false,  // Permission to access photo library needed for ImagePicker
      canRequestMediaLibraryAccess: true,  // Can we prompt user again for access to photo library

      locationMethod: 'gps',  // The currently selected method of location acquisition out of 'gps', 'address' and 'latlong'
      location: {latitude: 0, longitude: 0},
      enteredAddress: "",
      geolocationAccuracy: Location.Accuracy.Balanced,  // Accuracy to lookup location to. See https://docs.expo.dev/versions/latest/sdk/location/#accuracy
      locating: false,

      submitted: false,
      submitting: false,

      stylesheet: this.props.stylesheet,
      errorMsg: "Missing Fields",  // Error message to display to user
    };

    // Make state accessible through this from all functions
    this.renderFieldsIntoComponents = this.renderFieldsIntoComponents.bind(this);
    this.onChangeTextInput = this.onChangeTextInput.bind(this);
    this.ensureMediaLibraryAccess = this.ensureMediaLibraryAccess.bind(this);
    this.handleGalleryUpload = this.handleGalleryUpload.bind(this);
    this.handleDocumentUpload = this.handleDocumentUpload.bind(this);
    this.getLocationMethodComponent = this.getLocationMethodComponent.bind(this);
    this.locateDevice = this.locateDevice.bind(this);
    this.lookupAddress = this.lookupAddress.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.render = this.render.bind(this);
  }


  /*
   * Constructs a list of view components from state.fields.
   * @returns {ReactNative View[]} - The list of components
   */
  renderFieldsIntoComponents() {
    var locationRadioProps = [
      {label: 'GPS', value: 0, tag: 'gps'},
      {label: 'Address Lookup', value: 1,  tag: 'address'},
      {label: 'Latitude-Longitude', value: 2,  tag: 'latlong'},
    ];
    const formComponents = [];
    let counter = 0;
    for (const field of this.state.fields) {
      var item;
      switch (field.type) {
        case LinearForm.FieldTypes.Text: {
          item = 
            <View key={counter} style={this.state.stylesheet.field}>
              <Text style={this.state.stylesheet.text}>{field.text}</Text>
            </View>
          break;
        }

        case LinearForm.FieldTypes.Question: {
          item = 
            <View key={counter} style={this.state.stylesheet.field}>
              <Text style={this.state.stylesheet.text}>{field.prompt}</Text>
              <TextInput 
                style={this.state.stylesheet.textInput}
                onChangeText={answer => this.onChangeTextInput(field.prompt, answer)}
                />
            </View>
          break;
        }

        case LinearForm.FieldTypes.GalleryUpload: {
          item = 
            <View key={counter} style={this.state.stylesheet.field}>
              <Pressable 
                accessibilityLabel="Click to upload images or videos" 
                style={this.state.stylesheet.button} 
                onPress={this.handleGalleryUpload}
              >
                <Text style={this.state.stylesheet.buttonTitle}>
                  Upload Images or Videos
                </Text>
              </Pressable>
              <View style={this.state.stylesheet.mediaPreview}>
                {this.state.galleryUploads.map(
                  upload => <Image style={this.state.stylesheet.imagePreview} source={{uri: upload.uri}}/>
                )}
              </View>
            </View>
          break;
        }

        case LinearForm.FieldTypes.DocumentUpload: {
          item =
            <View key={counter} style={this.state.stylesheet.field}>
              <Pressable
                accessibilityLabel="Click to upload other files like PDFs"
                style={this.state.stylesheet.button}
                onPress={this.handleDocumentUpload}
              >
                <Text style={this.state.stylesheet.buttonTitle}>
                  Upload Other Files
                </Text>
              </Pressable>
              <View style={this.state.stylesheet.mediaPreview}>
                {this.state.documentUploads.map(upload => <Text style={this.state.stylesheet.text}>{upload.name}</Text>)}
              </View>
            </View>
          break;
        }

        case LinearForm.FieldTypes.Location: {
          item = 
            <View key={counter} style={this.state.stylesheet.field}>
              <Text style={this.state.stylesheet.text}>
                Choose location specification method: {"\n"}
              </Text>
              <RadioForm formHorizontal={false} style={this.state.stylesheet.radioForm}>
                {locationRadioProps.map((item) => (
                  <RadioButton labelHorizontal={true} key={item.value}>
                    <RadioButtonInput
                      obj={item}
                      index={item.value}
                      isSelected={this.state.locationMethod === item.tag}
                      onPress={() => this.setState({locationMethod: item.tag})}
                      buttonSize={15}
                      buttonInnerColor={Colours.PRIMARY}
                      buttonOuterColor={Colours.PRIMARY}
                    />
                    <RadioButtonLabel
                      obj={item}
                      index={item.value}
                      onPress={() => this.setState({locationMethod: item.tag})}
                      labelStyle={this.state.stylesheet.text}
                    />
                  </RadioButton>
                ))}
              </RadioForm>
              {this.getLocationMethodComponent(this.state.locationMethod)}
              <Text style={this.state.stylesheet.text}>
                Latitude: {this.state.location.latitude} Longitude: {this.state.location.longitude}
              </Text>
            </View>
          break;
        }

        case LinearForm.FieldTypes.Heading: {
          item = 
            <View key={counter} style={this.state.stylesheet.field}>
              <Text style={this.state.stylesheet.heading}>{field.text}</Text>
            </View>
          break;
        }

        case LinearForm.FieldTypes.Subheading: {
          item = 
            <View key={counter} style={this.state.stylesheet.field}>
              <Text style={this.state.stylesheet.subheading}>{field.text}</Text>
            </View>
          break;
        }

        case LinearForm.FieldTypes.Seperator: {
          item = <View key={counter} style={this.state.stylesheet.seperator} /> //TODO: Implement styling
        }

        default:
          item = null;
      }
      if (item) {
        counter += 1;
        formComponents.push(item);
      }
    }
    return formComponents;
  }


  /*
   * Takes a text input and stores the inputted answer in state.textInputs
   * @param prompt - the corresponding prompt text for the input
   * @param answer - the inputted answer
   */
  onChangeTextInput(prompt, answer) {
    this.state.textInputs.set(prompt, answer)
    console.log(prompt + ": " + answer)
  }


  /*
   * Checks to see if the app has media library access rights, and if not requests them.
   * @returns {boolean} - Whether the app has access or not.
   */
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


  /*
   * Open ImagePicker and store a single chosen image/video in state.galleryUploads
   */
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
    }
  }


  /*
   * Open DocumentPicker and store a single chosen document of type props.documentUploadTypes in state.documentUploads
   */
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
    }
  }


  /*
   * Produces the view component for the location acquisition method.
   * @param method - the chosen location acquisition method.
   * @return {ReactNative View} - the constructed view component.
   */
  getLocationMethodComponent(method) {
    let chosenMethodComponent;
      switch(method) {
        case 'gps': {
          if (this.state.locating) {
            chosenMethodComponent = 
              <Pressable
                style={this.state.stylesheet.button}
                disabled={true}
              >
                <Text style={this.state.stylesheet.buttonTitle}>Locating...</Text>
              </Pressable>
          } else {
            chosenMethodComponent = 
            <Pressable
              style={this.state.stylesheet.button}
              accessibilityLabel="Click to locate this device using GPS"
              onPress={this.locateDevice}
            >
              <Text style={this.state.stylesheet.buttonTitle}>Locate Me</Text>
            </Pressable>
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
                style={this.state.stylesheet.textInput}
              />
              <Pressable
                style={this.state.stylesheet.button}
                disabled={true}
              >
                <Text style={this.state.stylesheet.buttonTitle}>Looking Up...</Text>
              </Pressable>
              
            </>
          } else {
            chosenMethodComponent = 
            <>
              <TextInput
                placeholder="Address"
                autoComplete='postal-address'
                onChangeText={addr => this.setState({enteredAddress: addr})}
                style={this.state.stylesheet.textInput}
              />
              <Pressable
                style={this.state.stylesheet.button}
                onPress={this.lookupAddress}
                accessibilityLabel="Click to lookup the entered address"
              >
                <Text style={this.state.stylesheet.buttonTitle}>Lookup</Text>
              </Pressable>
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
                style={this.state.stylesheet.textInput}
              />
              <TextInput
                placeholder="Longitude"
                onChangeText={long => this.setState({location: {latitude: this.state.location.latitude, longitude: long}})}
                style={this.state.stylesheet.textInput}
              />
            </>
          break;
        }
    }
    return chosenMethodComponent;
  }


  /*
   * Geolocate device using expo-location and store result in state.location
   */
  async locateDevice() {
    let currPermission = await Location.requestForegroundPermissionsAsync();
    if (currPermission.granted) {
      this.setState({locating: true});
      let currLocation = await Location.getCurrentPositionAsync({accuracy: this.state.geolocationAccuracy});
      this.setState({location: {latitude: currLocation.coords.latitude, longitude: currLocation.coords.longitude}});
      this.setState({locating: false});
    }
  }


  /*
   * Looks up address stored in state.enteredAdress using expo-location and store result in state.location
   */
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


  /*
   * Take inputted data and format into JSON object, then pass to onSubmit()
   */
  submitForm() {
    let formJSON = {};
    let textualData = [];
    for (const field of this.state.fields) {
      if (field.type == LinearForm.FieldTypes.Question) {
        // Handle special input fields
        let answer = this.state.textInputs.get(field.prompt);
        if (!answer) answer = "";
        switch (field.id) {
          case 'title':
            formJSON.title = answer;
            break;
          case 'summary':
            formJSON.summary = answer;
            break;
          case 'author':
            formJSON.author = answer;
            break;
          case 'tags':
            formJSON.title = answer;
            break;
          default:
            textualData.push({prompt: field.prompt, answer: answer});
        }
      }
    }
    formJSON.textualData = textualData;
    formJSON.location = this.state.location;
    if (this.state.galleryUploads.length > 0) formJSON.media = this.state.galleryUploads;
    if (this.state.documentUploads.length > 0) formJSON.documents = this.state.documentUploads;

    this.setState({submitting: true});
    const success = this.props.onSubmit(formJSON);  // Return form data to user defined function.
    if (success) this.setState({submitted: true});
    else this.setState({errorMessage: "Failed to upload post. Try Again"})
    this.setState({submitting: false});
  }


  render() {
    let buttonText = "";
    if (this.state.submitting) buttonText = "Submitting...";
    else if (this.state.submitted) buttonText = "Submitted!";
    else buttonText = "Submit";

    return (
      <View style={this.state.stylesheet.container}>
        <ScrollView>
          {this.renderFieldsIntoComponents()}
          <View style={this.state.stylesheet.field}>
              <Pressable
                style={this.state.stylesheet.button}
                disabled={this.state.submitted || this.state.submitting}
                onPress={this.submitForm}
                accessibilityLabel="Click to submit the form"
              >
                <Text style={this.state.stylesheet.buttonTitle}>{buttonText}</Text>
              </Pressable>
            <Text style={this.state.stylesheet.errorMessage}>{this.state.errorMsg}</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default LinearForm;