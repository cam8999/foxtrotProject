import { Alert, View, StyleSheet } from 'react-native';

import LinearForm from '../components/form';
import Colours from '../styles';

const FieldTypes = LinearForm.FieldTypes;

const uploadFormFields = new Array(
  { type: FieldTypes.Heading, text: "Upload a Post" },
  { type: FieldTypes.Subheading, text: 'General Information' },
  { type: FieldTypes.Question, prompt: 'What is the title of the research?', id: 'title', required: true },
  { type: FieldTypes.Question, prompt: 'Who is the author(s) of the research?', id: 'author', required: true },
  { type: FieldTypes.Question, prompt: 'Provide a summary of the research:', id: 'description', required: true },
  { type: FieldTypes.Question, prompt: 'Provide some comma-seperated tags for the project, for example the hazard it relates to:', id: 'tags', required: true },
  { type: FieldTypes.Location },
  { type: FieldTypes.Subheading, text: 'Threat' },
  { type: FieldTypes.Question, prompt: 'What environmental threat does this relate to?', required: true },
  { type: FieldTypes.Question, prompt: 'How have these threats changed over the last decades?' },
  { type: FieldTypes.Question, prompt: 'How were these changes observed?', required: true },
  { type: FieldTypes.Subheading, text: 'Actions Taken' },
  { type: FieldTypes.Question, prompt: 'Over what time frame were observations made?', required: true },
  { type: FieldTypes.Question, prompt: 'How have these threats been mitigated or adapted to?', required: true },
  { type: FieldTypes.Question, prompt: 'How successful were the actions taken?', required: true },
  { type: FieldTypes.Question, prompt: 'How was the success evaluated?', required: true },
  { type: FieldTypes.Question, prompt: 'Are there any other factors which could explain the success?', required: true },
  { type: FieldTypes.Question, prompt: 'What proof do you have of these outcomes?', required: true },
  { type: FieldTypes.Question, prompt: 'Could the actions taken be applied elsewhere?', required: true },
  { type: FieldTypes.Heading, text: 'Source of Knowledge' },
  { type: FieldTypes.Question, prompt: 'Are you reporting first-hand, or on behalf of someone else?' },
  { type: FieldTypes.Question, prompt: 'What is the status in the community of the knowledge holder?' },
  { type: FieldTypes.Question, prompt: 'What related experience does the knowledge holder have?' },
  { type: FieldTypes.Heading, text: "Files, Images and Videos" },
  { type: FieldTypes.GalleryUpload },
  { type: FieldTypes.DocumentUpload },
  { type: FieldTypes.Text, text: 'Changes cannot be made after uploading the post. Are you sure you want to submit now?' },
)

const acceptedDocumentTypes = new Array(  // List of document (non-media) file formats to accept as uploads.
  'application/msword',  // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // .docx
  'application/pdf',  // .pdf
  'application/vnd.oasis.opendocument.text',  // .odt
  'application/vnd.ms-powerpoint',  // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',  // .pptx
  'text/plain',  // .txt
)


// TODO: Integrate with uploadPostToDB in main branch
function uploadFormDataToDB(formData) {
  console.log("Uploaded:");
  console.log(formData);
  return true;
  /*
  const user = getUser();
  if (!user) {
    Alert.alert("You must be logged in to create a post.");
    return;
  }
  const postID = uploadPostToDB(formData, user);  
  if (!postID) {
    Alert.alert("Post failed to upload to Firebase Database. Try Again.");
    return;
  }
  for (const medium of formData.media) {
    uploadFile(medium.uri, postId);
  }
  for (const doc of formData.documents) {
    uploadFile(doc.uri, postId);
  } */
}


export const UploadFormStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },

  field: {
    padding: 10,
  },

  heading: {
    fontWeight: 'bold',
    fontSize: 24,
    margin: 5,
  },

  subheading: {
    fontSize: 18,
    margin: 5,
    color: Colours.PRIMARY,
    fontWeight: 'bold',
  },

  text: {
    margin: 5,
  },

  radioForm: {
    margin: 5,
    padding: 10,
  },

  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#C0C0C0',
    margin: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },

  button: {
    backgroundColor: Colours.PRIMARY,
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 0,
    margin: 10,
    alignSelf: 'flex-start',
  },

  buttonTitle: {
    fontWeight: 'bold',
    color: 'white',
  },

  imagePreview: {
    width: 80,
    height: 80
  },

  mediaPreview: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  errorMessage: {
    color: 'red',
    margin: 5,
  },

  seperator: {

  },

});

// TODO: Replace placeholder with actual header bar
function UploadScreen({ navigation }) {
  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#C0C0C0' }}>
      <View style={{ height: 50, width: '100%', backgroundColor: Colours.PRIMARY }}></View>
      <LinearForm
        fields={uploadFormFields}
        documentUploadTypes={acceptedDocumentTypes}
        onSubmit={uploadFormDataToDB}
        stylesheet={UploadFormStyle} />
    </View>
  )
}

export default UploadScreen;