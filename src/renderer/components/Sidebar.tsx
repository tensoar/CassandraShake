import {
    Navbar,
    ScrollArea,
    NavbarProps,
    Title,
    ThemeIcon,
    Center,
    Menu,
    List,
    Button,
    Space,
    Divider,
    UnstyledButton,
    Group,
    Avatar,
    Text,
} from '@mantine/core';
import _ from 'lodash';
import { Database } from 'tabler-icons-react';

export default function Sidebar(props: { nav: Partial<NavbarProps> }) {
    return (
        <Navbar {...props.nav}>
            <Navbar.Section>
                <Center inline>
                    <ThemeIcon>
                        <Database />
                    </ThemeIcon>
                    <Title order={5} ml={10}>
                        Connections
                    </Title>
                </Center>
                <Divider mt={20} />
            </Navbar.Section>
            <Navbar.Section grow pt={12} component={ScrollArea}>
                {_.fill(Array(50), 2).map((_v, i) => {
                    return (
                        <div>
                            <UnstyledButton
                                sx={(theme) => ({
                                    display: 'block',
                                    width: '100%',
                                    padding: theme.spacing.xs,
                                    borderRadius: theme.radius.sm,
                                    color:
                                        theme.colorScheme === 'dark'
                                            ? theme.colors.dark[0]
                                            : theme.black,

                                    '&:hover': {
                                        backgroundColor:
                                            theme.colorScheme === 'dark'
                                                ? theme.colors.dark[6]
                                                : theme.colors.gray[0],
                                    },
                                })}
                            >
                                <Group>
                                    <Avatar size={30} color="blue">
                                        DB
                                    </Avatar>
                                    <div>
                                        <Text>本地连接{i}</Text>
                                    </div>
                                </Group>
                            </UnstyledButton>
                            {/* <Button
                                variant="white"
                                fullWidth
                                leftIcon={<Database color="teal" size={16} />}
                            >
                                本地连接{i}
                            </Button>
                            <Divider /> */}
                        </div>
                    );
                })}
                {/* </List> */}
            </Navbar.Section>
        </Navbar>
    );
}
