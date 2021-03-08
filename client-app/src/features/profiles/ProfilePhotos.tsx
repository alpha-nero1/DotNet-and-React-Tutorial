import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useState } from 'react'
import { Card, Header, Tab, Image, Grid, Button } from 'semantic-ui-react';
import PhotoUploadWidget from '../../app/common/image-upload/PhotoUploadWidget';
import { useStore } from '../../app/stores/store';
import { Photo, Profile } from '../../types/profile';

interface Props {
  profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
  // Do not destructure like this!
  const { profileStore: { isCurrentUser, uploadPhoto, isUploading, setMainPhoto, isLoading, deletePhoto } } = useStore();
  const [addPhotoMode, setAddPhotoMode] = useState<boolean>(false);
  const [target, setTarget] = useState('');

  function handlePhotoUpload(file: Blob) {
    uploadPhoto(file)
    .then(() => {
      setAddPhotoMode(false);
    })
  }

  function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
    setTarget(e.currentTarget.name);
    setMainPhoto(photo);
  } 

  function handleDeletePhoto(photo: Photo, e: any): void {
    setTarget(e.currentTarget.name);
    deletePhoto(photo);
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header icon='image' content='Photos' floated='left'/>
          {
            isCurrentUser && (
              <Button
                floated='right' 
                basic 
                content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                onClick={() => setAddPhotoMode(!addPhotoMode)}
              />
            )
          }
        </Grid.Column>
        <Grid.Column width={16}>
          {
            addPhotoMode ? (
              <PhotoUploadWidget uploadPhoto={handlePhotoUpload} isLoading={isUploading} />
            ) : (
              <Card.Group itemsPerRow={5}>
                {profile.photos?.map(photo => (
                  <Card key={photo.id}>
                  <Image src={photo.url || '/assets/Images/user.png'}/>
                  {
                    isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button  
                          basic
                          color='green'
                          content='Main'
                          name={`main${photo.id}`}
                          disabled={photo.isMain}
                          loading={target === 'main' + photo.id && isLoading}
                          onClick={e => handleSetMainPhoto(photo, e)}
                        />
                        <Button 
                          basic
                          color='red'
                          icon='trash'
                          name={photo.id}
                          loading={target === photo.id && isLoading}
                          onClick={e => handleDeletePhoto(photo, e)}
                          disabled={photo.isMain}
                        />
                      </Button.Group>
                    )
                  }
                  </Card>
                ))}
              </Card.Group>
            )
          }
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
});
