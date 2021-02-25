import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
  inverted?: boolean;
  content?: string;
}

export default function LoadingCircle(props: Props = { inverted: true, content: 'Loading...' }) {
  return (
    <Dimmer active={true} inverted={props.inverted}>
      <Loader content={props.content}/>
    </Dimmer>
  )
}