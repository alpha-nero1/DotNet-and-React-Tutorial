
import { Formik, Form, Field, FieldProps } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Header, Comment, Button, Loader } from 'semantic-ui-react'
import TextArea from '../../../app/common/form/TextArea'
import { useStore } from '../../../app/stores/store'
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns'

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat(props : Props) {
    const { commentStore } = useStore();

    useEffect(() => {
        if (props.activityId) {
            commentStore.createHubConnection(props.activityId);
        }
        // The function you return is what is execued when the component is cleaned up.
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, props.activityId]);

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='blue'
                style={{border: 'none'}}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment clearing>
                <Formik
                    initialValues={{body: ''}}
                    onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
                    validationSchema={Yup.object({
                        body: Yup.string().required()
                    })}
                >
                    {({ isSubmitting, isValid, handleSubmit }) => (
                        <Form className='ui form'>
                            <Field 
                                name='body'
                            >
                                {(props: FieldProps) => (
                                    <div style={{position: 'relative'}}>
                                        <Loader active={isSubmitting}/>
                                        <textarea
                                            placeholder='Enter your comment, press shift enter for a new line.'
                                            rows={2}
                                            {...props.field}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && e.shiftKey) {
                                                    return;
                                                }
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    isValid && handleSubmit();
                                                }
                                            }}
                                        >

                                        </textarea>
                                    </div>
                                )}

                            </Field>
                        </Form>
                    )}
                </Formik>
                <Comment.Group>
                    {
                        commentStore.comments.map(comment => (
                            <Comment key={comment.id}>
                                <Comment.Avatar src={comment.image || '/assets/Images/user.png'}/>
                                <Comment.Content>
                                    <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.username}</Comment.Author>
                                    <Comment.Metadata>
                                        <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                    </Comment.Metadata>
                                    <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                                </Comment.Content>
                            </Comment>
                        ))
                    }
                </Comment.Group>
            </Segment>
        </>

    )
})