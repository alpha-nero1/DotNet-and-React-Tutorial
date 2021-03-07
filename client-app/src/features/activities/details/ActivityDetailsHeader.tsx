import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image, Label} from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import { Activity } from '../../../types/activity';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    activity: Activity
}

export default observer(function ActivityDetailedHeader({activity}: Props) {
    const { activityStore } = useStore();
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {activity.isCancelled && (
                    <Label
                        ribbon
                        color='red'
                        content='Is cancelled'
                        style={{ zIndex: 1000, left: -14, top: 20, position: 'absolute' }}
                    />
                )}
                <Image src={`/assets/Images/categoryImages/${activity.category}.jpg`} fluid style={activityImageStyle}/>
                <Segment style={activityImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(activity.date as Date, 'dd MMM yyyy')}</p>
                                <p>
                                    Hosted by <strong><Link to={`/profiles/${activity.host?.username}`}>{activity.host?.displayName}</Link></strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {
                (
                    activity.isHost ? (
                        <>
                            <Button 
                                color={activity.isCancelled ? 'green' : 'red'}
                                floated='left'
                                basic
                                content={activity.isCancelled ? 'Re-activate activity' : 'Cancel activity'}
                                onClick={activityStore.cancelActivityToggle}
                                loading={activityStore.isSubmitting}
                            />
                            <Button
                                color='orange' 
                                floated='right' 
                                as={Link} 
                                to={`/activities/manage/${activity.id}`}
                                disabled={activity.isCancelled}
                            >
                                Manage Event
                            </Button>
                        </>
                    ) : (
                        activity.isGoing ? (
                            <Button loading={activityStore.isSubmitting} onClick={activityStore.updateAttendance}>Cancel attendance</Button>

                        ) : (
                            <Button 
                                loading={activityStore.isSubmitting} 
                                onClick={activityStore.updateAttendance} 
                                color='blue'
                                disabled={activity.isCancelled}
                            >Join Activity</Button>
                        )
                    )
                )
                }
                
            </Segment>
        </Segment.Group>
    )
})
