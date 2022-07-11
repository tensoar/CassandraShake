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
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Database } from 'tabler-icons-react';
import CassandraInfo from '../../main/entity/CassandraInfo';
import ConstantUtil from '../../main/util/ConstantUtil';
import LocalStorageIpc from '../storage/LocalStorageIpc';

export default function Sidebar(props: { nav: Partial<NavbarProps> }) {
    const [currentConnectionId, setCurrentConnectionId] = useState(-1);
    const [connections, setConnections] = useState<CassandraInfo[]>([]);

    useEffect(() => {
        ipcRenderer.on(ConstantUtil.BVIpcChannel.FOCUS, (e, connId: number) => {
            setCurrentConnectionId(connId);
        });

        LocalStorageIpc.findManyConnection().then(conns => {
            if (conns !== null) {
                setConnections(__ => conns);
            }
        });
    }, []);

    const openOrFocus = (connectionId: number) => {
        ipcRenderer.send(ConstantUtil.BVIpcChannel.ADD_OR_FOUCUS, connectionId);
        setCurrentConnectionId(connectionId);
    }

    return (
        <Navbar {...props.nav}>
            <Navbar.Section mt={10}>
                <Center inline>
                    <ThemeIcon>
                        <Database />
                    </ThemeIcon>
                    <Title order={5} ml={10}>
                        Connections
                    </Title>
                </Center>
                <Divider mt={16} />
            </Navbar.Section>
            <Navbar.Section grow pt={12} component={ScrollArea}>
                {connections.map((conn, i) => {
                    return (
                        <div key={conn.id}>
                            <UnstyledButton
                                onClick={() => openOrFocus(i)}
                                sx={(theme) => ({
                                    display: 'block',
                                    width: '100%',
                                    padding: theme.spacing.xs,
                                    borderRadius: theme.radius.sm,
                                    backgroundColor: currentConnectionId === i ? theme.colors.cyan[2] : theme.colors.gray[1],
                                    color:
                                        theme.colorScheme === 'dark'
                                            ? theme.colors.dark[2]
                                            : theme.black,

                                    '&:hover': {
                                        backgroundColor:
                                            theme.colorScheme === 'dark'
                                                ? theme.colors.dark[6]
                                                : theme.colors.cyan[2],
                                    },
                                })}
                            >
                                <Group>
                                    <Avatar size={30} color="blue">
                                        DB
                                    </Avatar>
                                    <div>
                                        <Text>{conn.name}</Text>
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
