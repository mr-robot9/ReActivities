import React from 'react'
import { Menu, Container, Button } from "semantic-ui-react";

export const NavBar = () => {
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
                    <Button positive content='Create Activity'/>
                </Menu.Item>
            </Container>

        </Menu>
    )
}
