import React from 'react'
import { Menu, Container, Button } from "semantic-ui-react";

interface IProps
{
    handleOpenCreateForm: () => void;
}

/*
This component handles the navbar feature
*/


export const NavBar : React.FC<IProps> = ({handleOpenCreateForm}) => {
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header>
                    <img src="/Assets/Images/logo.png" alt="logo"/>
                    ReActivities
            </Menu.Item>
                <Menu.Item
                    name='Activities'
                />
                <Menu.Item>
                    <Button onClick = {handleOpenCreateForm } positive content='Create Activity'/>
                </Menu.Item>
            </Container>

        </Menu>
    )
}
