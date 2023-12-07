import React, { useEffect } from 'react';

//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux';

//Import Material UI Components.
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const ProjectList = () => {

    //Reducer States.
    const dispatch = useDispatch();
    const arrUserProjects = useSelector(state => state.arrUserProjects);
    const inSelectedProjectID = useSelector(state => state.inSelectedProjectID);
    const isTrackerStart = useSelector(state => state.isTrackerStart);

    //handle user project selection.
    const updateSelectedProjectID = (projectID) => {
        dispatch({ type: 'UPDATE_SELECTED_PROJECT_ID', payload: projectID });
    };

    //By default first project from the list is selected.
    useEffect(() => {
        updateSelectedProjectID(arrUserProjects[0].id);
        // eslint-disable-next-line
    }, [arrUserProjects]);

    //Render project list.
    let arrUserProjectsItems = arrUserProjects.map((item, key) => (
        <div className="project" key={`project-div-list-item-${key}`} >
            <ListItem
                key={`project-list-item-${key}`}
                button
                selected={inSelectedProjectID === item.id}
                onClick={() => updateSelectedProjectID(item.id)}
                className="project-list-item"
                disabled={isTrackerStart && inSelectedProjectID !== item.id}
            >
                <Radio color="primary" checked={inSelectedProjectID === item.id} size="small" />
                <ListItemText secondary={item.name} />
            </ListItem>
        </div >
    ));

    return (
        <div className="project-list-component">
            <Grid container>
                <Grid item xs={12}>
                    <div className="project-list">
                        <List>
                            <RadioGroup >
                                {arrUserProjectsItems}
                            </RadioGroup>
                        </List>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default ProjectList;