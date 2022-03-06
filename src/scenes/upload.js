import {View} from 'react-native';

import Form from '../components/form';
import Colours from '../styles';

const uploadFormFields = new Array(
  {type: 'text', prompt: 'Title'},
  {type: 'text', prompt: 'Summary'},
  {type: 'file-upload'},
  {type: 'image-upload'}
)

function UploadScreen({ navigation }) {
  return (
    
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#C0C0C0' }}>
      <View style={{  height: 50, width: '100%', backgroundColor: Colours.PRIMARY }}></View>
      <Form fields={uploadFormFields} />
    </View>
  )
}

export default UploadScreen