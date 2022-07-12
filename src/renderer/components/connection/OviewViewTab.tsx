import { Badge, Box, Button, Center, SimpleGrid, Space, Text, Title, useMantineTheme } from "@mantine/core";
import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";

import { useTypedDispath, useTypedSelector } from "../../redux/HooksWrapper";
import ConstantUtil from "../../../main/util/ConstantUtil";
import LocalStorageIpc from "../../storage/LocalStorageIpc";
import { disConnectionAction, connectAction } from "../../redux/reducer/ConnectionReducer";
import CassandraInfo from "../../../main/entity/CassandraInfo";

export default function OverviewTab() {
    const dispatch = useTypedDispath();
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const connectionId = useTypedSelector(state => state.connectionState.connectionId);
    const [connectionInfo, setConnectionInfo] = useState<CassandraInfo | null>(null);

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
        // await ipcRenderer.invoke(ConstantUtil.BVIpcChannel.REMOVE, connectionId) as number;
    }

    const doConnect = async () => {
        dispatch(connectAction(null as any));
    }

    const deleteConnection = async() => {
        await closeConnection();
        await ipcRenderer.invoke(ConstantUtil.BVIpcChannel.REMOVE, connectionId) as number;
        LocalStorageIpc.deleteConnection(connectionId);
    }

    return <Center style={{width: '100%', height: '100%', backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]}}>
        <SimpleGrid cols={2} pt={60}>
            <Box style={{display: 'flex'}}>
                <Title
                    order={4}
                    sx={th => ({
                        color: th.colorScheme === "dark" ? theme.colors.gray[6] : theme.colors.dark[4]
                    })}
                    // color={theme.colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.red[4]}
                >
                    名称:
                </Title>
                <Space w="md" />
                <Text
                    color={theme.colorScheme === "dark" ? theme.colors.gray[6] : theme.colors.dark[4]}
                >
                    {connectionInfo && connectionInfo.name}
                </Text>
            </Box>
            <Space h="sm" />
            <Box style={{display: 'flex'}}>
                <Title
                    order={4}
                    sx={th => ({
                        color: th.colorScheme === "dark" ? theme.colors.gray[6] : theme.colors.dark[4]
                    })}
                >
                    主机:
                </Title>
                <Space w="md" />
                <Text
                    color={theme.colorScheme === "dark" ? theme.colors.gray[6] : theme.colors.dark[4]}
                >
                    {connectionInfo && connectionInfo.hosts}
                </Text>
            </Box>
            <Space h="sm" />
            <Box style={{display: 'flex'}}>
                <Title
                    order={4}
                    sx={th => ({
                        color: th.colorScheme === "dark" ? theme.colors.gray[6] : theme.colors.dark[4]
                    })}
                >
                    状态:
                </Title>
                <Space w="md" />
                <Badge color={isConnected ? "teal" : "gray"} >{isConnected ? '已连接' : '未连接'}</Badge>
            </Box>
            <Space h="sm" />
            {isConnected ? <Button variant="outline" color="red" onClick={closeConnection}>关闭</Button> : <Button  variant="outline" onClick={doConnect}>连 接</Button>}
            <Button variant="outline" color="red" onClick={deleteConnection}>删 除</Button>
        </SimpleGrid>
    </Center>
}