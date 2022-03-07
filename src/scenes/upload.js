import {View} from 'react-native';

import LinearForm from '../components/form';
import Colours from '../styles';


const uploadFormFields = new Array(
  { type: 'heading', text: "Post Details" },
  { type: 'sub-heading', text: 'General Information' },
  { type: 'text', prompt: 'Title'},
  { type: 'text', prompt: 'Summary'},
  { type: 'location'},
  { type: 'sub-heading', text: 'Threat' },
  { type: 'text', prompt: 'What environmental threat does this relate to?'},
  { type: 'text', prompt: 'How have these threats changed over the last decades?'},
  { type: 'text', prompt: 'How did were these changes observed?'},
  { type: 'sub-heading', text: 'Actions Taken' },
  { type: 'text', prompt: 'Over what time frame were observations made?'},
  { type: 'text', prompt: 'How have these threats been mitigated or adapted to?'},
  { type: 'text', prompt: 'How succesful were the actions taken?'},
  { type: 'text', prompt: 'How was the success evaluated?'},
  { type: 'text', prompt: 'Are there any other factors which could explain the success?'},
  { type: 'text', prompt: 'What proof do you have of these outcomes?'},
  { type: 'text', prompt: 'Could the actions taken be applied elsewhere?'},
  { type: 'heading', text: 'Source of Knowledge'},
  { type: 'text', prompt: 'Are you reporting first-hand, or on behalf of someone else?'},
  { type: 'text', prompt: 'What is the status in the community of the knowledge holder?'},
  { type: 'text', prompt: 'What related experience does the knowledge holder have?'},
  { type: 'heading', text: "Files, Images and Videos" },
  { type: 'gallery-upload'},
  { type: 'document-upload'},
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

function UploadScreen({ navigation }) {
  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#C0C0C0' }}>
      <View style={{  height: 50, width: '100%', backgroundColor: Colours.PRIMARY }}></View>
      <LinearForm fields={uploadFormFields} documentUploadTypes={acceptedDocumentTypes} />
    </View>
  )
}

export default UploadScreen