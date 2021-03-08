import React, { useEffect, useState } from 'react'
import { Button, Grid, Header } from 'semantic-ui-react'
import PhotoWidgetCropper from './PhotoWidgetCropper';
import PhotoWidgetDropzone from './PhotoWidgetDropzone'

interface Props {
    isLoading: boolean;
    uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget(props: Props) {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(blob => {
        if (blob) {
          props.uploadPhoto(blob);
        }
      })
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => {
        // Cleanup URL objects we made.
        URL.revokeObjectURL(file.preview);
      });
    }
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header sub color='blue' content='Step 1 - Add Photo'/>
        <PhotoWidgetDropzone setFiles={setFiles}/>
      </Grid.Column>
      <Grid.Column width={1}/>
      <Grid.Column width={4}>
        <Header sub color='blue' content='Step 2 - Resize Photo'/>
        {
          (files && files.length) && (
            <PhotoWidgetCropper setCropper={setCropper} imagePreview={files[0].preview}/>
          )
        }
      </Grid.Column>
      <Grid.Column width={1}/>
      <Grid.Column width={4}>
        <Header sub color='blue' content='Step 3 - Preview & Upload'/>
        {
          (files && files.length) && (
            <>
              <div className='img-preview' style={{ minHeight: 200, overflow: 'hidden' }} />
              <Button.Group width={2}>
                <Button loading={props.isLoading} onClick={onCrop} positive icon='check'/>
                <Button disabled={props.isLoading} onClick={() => setFiles([])} icon='close'/>
              </Button.Group>
            </>
          )
        }
        
      </Grid.Column>
    </Grid>
  )
}
