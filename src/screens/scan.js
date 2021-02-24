import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

// import Api from '../../lib/api';
import Helper from '../lib/helper';
import commonStyles from '../../commonStyles';

// Import the camera module
import Camera, { Constants } from "../components/camera";

// Import the Credentials module to extract useful credentials
import Credentials from "../components/credentials";

export default class Scan extends React.Component {
  constructor(props) {
    super(props);
    // Add in showCamera, showCredentials and recogonizedText state
    this.state = { errorMsg: '', loading: false, showCamera: false, showCredentials: false, recogonizedText: null,iden:null};
  }

  // Receive the recogonizedText from the Camera module
  onOCRCapture(recogonizedText) {
    console.log('onCapture', recogonizedText);
    this.setState({showCamera: false, showCredentials: Helper.isNotNullAndUndefined(recogonizedText), recogonizedText: recogonizedText});
  }

  render() {
    return (
      <View style={styles.container}>
        {
            // button to start scanning pancard
          <TouchableOpacity style={commonStyles.header} onPress={() => {
            this.setState({showCamera: true,showCredentials:false});
            }}>
              <Image style={commonStyles.logo} source={require('../../assets/logo.png')} />
              <Text style={commonStyles.sectionTitle}>PAN-O-SCAN</Text>
            </TouchableOpacity> 
        }   
        {
          // Display the camera to capture text
          this.state.showCamera &&
          <Camera
            cameraType={Constants.Type.back}
            flashMode={Constants.FlashMode.off}
            autoFocus={Constants.AutoFocus.on}
            whiteBalance={Constants.WhiteBalance.auto}
            ratio={'4:3'}
            quality={0.5}
            imageWidth={800}
            enabledOCR={true}
            onCapture={(data, recogonizedText) => this.onOCRCapture(recogonizedText)} 
            onClose={_ => {
              this.setState({showCamera: false});
            }}
          />
        }
        {
          // Extract and display valid credentials
          this.state.showCredentials &&
          <Credentials wordBlock={this.state.recogonizedText}/>
        }
        {
          this.state.loading &&
          <ActivityIndicator style={commonStyles.loading} size="large" color={'#219bd9'} />
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
  },
  contentContainer:{
      flex:1,
      padding:20,
  },
  content:{
      fontSize:20,
  },
  searchCamera: {
    backgroundColor:'red',
    width:200,
    height:50,
    borderRadius:5,
    marginLeft: 5,
    padding: 0,
    alignSelf: 'center'
  }
});