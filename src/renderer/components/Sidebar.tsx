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
    Switch,
    useMantineTheme,
} from '@mantine/core';
import { ipcRenderer } from 'electron';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Activity, Database, Seeding } from 'tabler-icons-react';

import ThemeUtil from '../util/ThemeUtil';
import CassandraInfo from '../../main/entity/CassandraInfo';
import ConstantUtil from '../../main/util/ConstantUtil';
import LocalStorageIpc from '../storage/LocalStorageIpc';

export default function Sidebar(props: { nav: Partial<NavbarProps> }) {
    const theme = useMantineTheme();
    const [currentConnectionId, setCurrentConnectionId] = useState(-1);
    const [connections, setConnections] = useState<CassandraInfo[]>([]);
    const [useDarkTheme, setUseDarkTheme] = useState(false);

    useEffect(() => {
        const focusCb = (_e: any, connId: number) => {
            setCurrentConnectionId(connId);
        }
        const addConnectionCb = (_e: any, newId: number) => {
            LocalStorageIpc.findOneConnection({id: newId}).then(connection => {
                if (connection == null) {
                    return;
                }
                setConnections(conns => [...conns, connection]);
            })
        };
        const deleteConnectionCb = (_e: any, id: number) => {
            setConnections(conns => {
                return conns.filter(c => c.id !== id);
            });
        };
        ipcRenderer.on(ConstantUtil.BVIpcChannel.FOCUS, focusCb);
        ipcRenderer.on(ConstantUtil.StorageIpcChannel.ADD_CONNECTION, addConnectionCb);
        ipcRenderer.on(ConstantUtil.StorageIpcChannel.DELETE_CONNECTION, deleteConnectionCb);

        LocalStorageIpc.findManyConnection().then(conns => {
            if (conns !== null) {
                setConnections(__ => conns);
            }
        });

        return () => {
            ipcRenderer.removeListener(ConstantUtil.BVIpcChannel.FOCUS, focusCb);
            ipcRenderer.removeListener(ConstantUtil.StorageIpcChannel.ADD_CONNECTION, addConnectionCb);
            ipcRenderer.removeListener(ConstantUtil.StorageIpcChannel.DELETE_CONNECTION, deleteConnectionCb);
        };
    }, []);

    const openOrFocus = (connectionId: number) => {
        ipcRenderer.send(ConstantUtil.BVIpcChannel.ADD_OR_FOUCUS, connectionId);
        setCurrentConnectionId(connectionId);
    }

    useEffect(() => {
        ipcRenderer.send(ConstantUtil.ActionChennel.CHANGE_THEME, useDarkTheme);
    }, [useDarkTheme]);

    return (
        <Navbar {...props.nav}>
            <Navbar.Section pt={10} pl={10}>
                <Center inline>
                    <ThemeIcon>
                        <Activity />
                    </ThemeIcon>
                    <Title
                        order={5}
                        ml={10}
                        sx={_th => ({
                            color: ThemeUtil.defaultFontColor(theme)
                        })}
                    >
                        Connections
                    </Title>
                    <Switch
                        ml={60}
                        color="dark"
                        size="lg"
                        onLabel='Dark'
                        offLabel='Light'
                        onChange={_e => setUseDarkTheme(d => !d)}
                        value="off"
                    />
                </Center>
                <Divider mt={16} />
            </Navbar.Section>
            <Navbar.Section grow pt={12} component={ScrollArea}>
                {connections.map((conn, _i) => {
                    return (
                        <div key={conn.id}>
                            <UnstyledButton
                                onClick={() => openOrFocus(conn.id)}
                                sx={(th) => ({
                                    display: 'block',
                                    width: '100%',
                                    padding: theme.spacing.xs,
                                    borderRadius: theme.radius.sm,
                                    // eslint-disable-next-line no-nested-ternary
                                    backgroundColor: currentConnectionId === conn.id ? (th.colorScheme === 'dark' ? th.colors.dark[6] : th.colors.cyan[2]) : (th.colorScheme === 'dark' ? th.colors.dark[5] : th.colors.gray[1]),
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
