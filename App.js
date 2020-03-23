import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function App() {

  const [downloadProgress, setDownloadProgress] = useState(0);
  const [document, setDocument] = useState(null);

  async function openShareDialogAsync(){

    if (!(await Sharing.isAvailableAsync())) {
      alert(`Uh oh, sharing isn't available on your platform`);
      return;
    }

    Sharing.shareAsync(document);

  };

  async function handleDownload(){

    const callback = downloadProgress => {
      const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      setDownloadProgress(progress * 100);
    };
    
    const downloadResumable = FileSystem.createDownloadResumable(
      'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf',
      FileSystem.documentDirectory + 'boleto.pdf',
      {},
      callback
    );
    
    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log('Finished downloading to ', uri);
      setDocument(uri);
    } catch (e) {
      console.error(e);
    }
    
    
  }

  useEffect(()=>{

    console.log(downloadProgress);

  }, [downloadProgress]);

  useEffect(()=>{

    handleDownload()

  },[]);

  return (
    
        <View style={styles.container}>
        
          <Text>{downloadProgress}</Text>
          <TouchableOpacity onPress={()=>{

            openShareDialogAsync();

          }}>

            <Text>compartilhar</Text>

          </TouchableOpacity>

        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
