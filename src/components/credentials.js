import React, { Component } from "react";
import { 
  StyleSheet,
  ScrollView,
  View, 
  Text,
  Button
} from "react-native";
import PropTypes from 'prop-types';
import commonStyles from '../../commonStyles';

export default class Credentials extends Component {
  state = {
    selectedWordIdx: -1,
    wordList: null,
    err:false,
  }

  componentDidMount() {
    let wordList = [];

    // Push all the words detected by the camera for extraction
    if(this.props.wordBlock && 
       this.props.wordBlock.textBlocks && 
       this.props.wordBlock.textBlocks.length > 0) {
      for(let idx=0; idx < this.props.wordBlock.textBlocks.length; idx++) {
        let text = this.props.wordBlock.textBlocks[idx].value;
        wordList.push(text);
      }
      this.setState({wordList: wordList});
      this.extractInfo(wordList); // extract credentials
    }
  }
  extractInfo(wordList){
    // minimum credentials to be present = 5 + 1 (for line zero)  
    if(wordList.length<6){
      this.setState({err:true});
    }
    let name="",fname="",dob="",pan="";

    // conditions for extracting credential from a string
    let lineZeroConditions = ["GOVT","GOVT.","INDIA","OFINDIA","OVT","NDIA"];
    let panConditions = ["Permanent","ermanent","manent","Pormanent","Account","ccount","count","Number","umber","Card","ard"];
    let fnameConditions = ["Father's","Father","Fathers"];
    let dobConditions = ["Date","ate","Dat","Dote","Birth","irth","ofBirth","Dateof","DateofBirth","Sirth"];
    let lineZero=null,format=null;
  
    for(let i=0;i<wordList.length;i++){
      let text=wordList[i];
      if(text && text.trim().length > 0) {
          let words = text.split(/[\s,.?]+/);
          const extractFielsFromString=(field,start,end,)=>{
            if(start===end || start===-1){
              field=wordList[i+1];
            }
            else{
              for(let y=start+1;y<words.length;y++){
                field+=(words[y]);
                if(y!=end)field+=(" ");
              }
            }
            return field;
          }
          if(words && words.length > 0) {
            if(!lineZero && lineZeroConditions.some((word)=>words.includes(word))){
              lineZero=i;
            }
            else if(lineZero && i===lineZero+1){
              if(panConditions.some((word)=>words.includes(word))){
                format="NEW"
              }
              else{
                format="OLD";
              }
            }
            
            if(format && format==="NEW"){
              if(!pan && panConditions.some((word)=>words.includes(word))){
                let start = words.indexOf("Card");
                let end = words.length-1;
                pan=extractFielsFromString(pan,start,end);  // PAN
              }  
              else if((!name || !fname) && (words.includes("Name")||words.includes("TH/Name"))){
                let start = words.indexOf("Name");
                let end = words.length-1;
                if(!fname && fnameConditions.some((word)=>words.includes(word))){
                  fname=extractFielsFromString(fname,start,end); // FATHER'S NAME
                }
                else{
                  if(words.includes("TH/Name"))start=words.indexOf("TH/Name");
                  name=extractFielsFromString(name,start,end);  // YOUR NAME
                }  
              }
              else if(!dob && dobConditions.some((word)=>words.includes(word))){
                let start = words.indexOf("Birth");
                let end = words.length-1;
                dob=extractFielsFromString(dob,start,end);  // Date Of Birth
              }
            }
            else if(format && format==="OLD"){
              if(!name){
                name=wordList[lineZero+1];  // YOUR NAME
                fname=wordList[lineZero+2];  // FATHER'S NAME
                dob=wordList[lineZero+3];  // Date Of Birth
              }
              else if(!pan && panConditions.some((word)=>words.includes(word))){
                let start = words.indexOf("Number");
                let end = words.length-1;
                pan=extractFielsFromString(pan,start,end);  // PAN
              }  
            }  
          }
        }
    }
    // missing some credential, throw error!
    if(!name || !fname || !dob || !pan){
      this.setState({
        err:true,
      })
    }
    let panInfo = {
      "Name":name,
      "Father's Name":fname,
      "DOB":dob,
      "PAN":pan,
    }
    this.setState({panInfo});
  }

  // UI  to display extracted credentials
  populateCredentials() {
    const wordViews = [];

      for(key in this.state.panInfo){
        console.log(key);
        wordViews.push(
          <View style={{flex:1,alignItems:'center',backgroundColor:'rgba(0,0,0,0.3)',marginVertical:5,padding:5}}>
          <Text style={styles.label}>{`${key}`}</Text>
          <Text style={styles.word}>{this.state.panInfo[key]}</Text>
          </View>
        )}
    return wordViews;
  }


  render() {
   
    return(
      <>
        {this.state.err?(
          <Text style={commonStyles.errMsg}>Error: please scan again...</Text>
        ):(
          <View style={[styles.container, this.props.style]}>
          <View style={styles.header}>
          <Text style={styles.headerText}>Please select a word below and click on the Ok button.</Text>
        </View>
        <ScrollView>
          <View style={styles.wordList}>
            { this.populateCredentials() }
          </View>
        </ScrollView>
        <Button title='OK' 
          disabled={!(this.state.selectedWordIdx >= 0 && this.state.wordList && this.state.wordList.length > this.state.selectedWordIdx)}
          onPress={() => {
            this.props.onWordSelected && this.props.onWordSelected(this.state.wordList[this.state.selectedWordIdx]);
          }}/>
        <View style={{minHeight: 30}}></View>
        </View>
        )}
        
      </>
    );
  }
}

Credentials.propTypes = {
  wordBlock: PropTypes.object,
  onWordSelected: PropTypes.func
};

Credentials.defaultProps = {
  wordBlock: null,
  onWordSelected: null
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'white'
  },
  header: {
    padding: 4,
  },
  headerText: {
    fontSize: 20
  },
  wordList: {
    flex: 1,
    padding: 5
  },
  word: {
    fontSize: 25,
    fontWeight: 'bold'
  },
  label:{
    fontSize: 20,
    color:'red',
  },
  okButton: {
    marginBottom: 50,
    fontSize: 30
  }
});