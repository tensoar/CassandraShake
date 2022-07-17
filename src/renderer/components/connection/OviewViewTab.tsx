import { Badge, Box, Button, Center, Grid, Group, List, LoadingOverlay, SimpleGrid, Space, Text, Title, useMantineTheme } from "@mantine/core";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

import { useTypedDispath, useTypedSelector } from "../../redux/HooksWrapper";
import ConstantUtil from "../../../main/util/ConstantUtil";
import LocalStorageIpc from "../../storage/LocalStorageIpc";
import { disConnectionAction, connectAction } from "../../redux/reducer/ConnectionReducer";
import CassandraInfo from "../../../main/entity/CassandraInfo";
import ThemeUtil from "../../util/ThemeUtil";
import CassandraUtil from "../../util/CassandraUtil";

export default function OverviewTab() {
    const dispatch = useTypedDispath();
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const connectionId = useTypedSelector(state => state.connectionState.connectionId);
    const [connectionInfo, setConnectionInfo] = useState<CassandraInfo | null>(null);
    const [keyspacesNumber, setKeyspacesNumber] = useState(-1);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        if (connectionId > 0) {
            LocalStorageIpc.findOneConnection({id: connectionId}).then(info => {
                if (info === null) {
                    return;
                }
                setConnectionInfo(__ => info);
            });
        }
    }, [connectionId]);

    const closeConnection = async () => {
        dispatch(disConnectionAction());
        setKeyspacesNumber(-1)
        // await ipcRenderer.invoke(ConstantUtil.BVIpcChannel.REMOVE, connectionId) as number;
    }

    const doConnect = async () => {
        if (connectionInfo === null) {
            return;
        }
        setIsConnecting(true);
        const client = await CassandraUtil.doConnection(connectionInfo);
        if (client == null) {
            setIsConnecting(false);
            return;
        }

        const {keyspaces} = client.metadata;
        setKeyspacesNumber(__ => Object.keys(keyspaces).length);
        dispatch(connectAction(client));
        setIsConnecting(false);
    }

    const deleteConnection = async() => {
        await closeConnection();
        await ipcRenderer.invoke(ConstantUtil.BVIpcChannel.REMOVE, connectionId) as number;
        LocalStorageIpc.deleteConnection(connectionId);
    }

    return <Center style={{width: '100%', height: '100%', backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]}}>
        <LoadingOverlay visible={isConnecting} />
        <Grid pt={60} style={{width: '80%'}}>
            <Grid.Col span={2}>
                <Title
                    order={4}
                    sx={th => ({
                        color: ThemeUtil.defaultFontColor(th)
                    })}
                    // color={theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.red[4]}
                >
                    名称:
                </Title>
            </Grid.Col>
            <Grid.Col span={10}>
                <Text
                    color={ThemeUtil.defaultFontColor(theme)}
                >
                    {connectionInfo && connectionInfo.name}
                </Text>
            </Grid.Col>

            <Grid.Col span={2}>
                <Title
                    order={4}
                    sx={th => ({
                        color: ThemeUtil.defaultFontColor(th)
                    })}
                >
                    主机:
                </Title>
            </Grid.Col>
            <Grid.Col span={10}>
                {connectionInfo && connectionInfo.hosts.split(',').map(h => (
                    <List>
                        <List.Item>
                            {h}
                        </List.Item>
                    </List>
                ))}
            </Grid.Col>

            <Grid.Col span={2}>
                <Title
                    order={4}
                    sx={th => ({
                        color: ThemeUtil.defaultFontColor(th)
                    })}
                >
                    状态:
                </Title>
            </Grid.Col>
            <Grid.Col span={10}>
                <Badge color={isConnected ? "teal" : "gray"} >{isConnected ? '已连接' : '未连接'}</Badge>
            </Grid.Col>

            <Grid.Col span={4}>
                <Title
                    order={4}
                    sx={th => ({
                        color: ThemeUtil.defaultFontColor(th)
                    })}
                >
                    数据库数量:
                </Title>
            </Grid.Col>
            <Grid.Col span={6}>
                <Text color={ThemeUtil.defaultFontColor(theme)}>{keyspacesNumber < 0 ? "-" : keyspacesNumber}</Text>
            </Grid.Col>

            <Grid.Col span={12} mt={20}>
                <Center>
                    <Group>
                        {isConnected ? <Button variant="outline" color="red" onClick={closeConnection}>关闭</Button> : <Button  variant="outline" onClick={doConnect} disabled={isConnecting}>连 接</Button>}
                        <Button variant="outline" color="red" onClick={deleteConnection} disabled={isConnecting}>删 除</Button>
                    </Group>
                </Center>
            </Grid.Col>
        </Grid>
    </Center>
}