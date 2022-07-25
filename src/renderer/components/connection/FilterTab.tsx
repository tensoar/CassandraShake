import { Textarea, useMantineTheme, Box, Center, Text, Group } from "@mantine/core";
import { useState } from "react";

import { useTypedSelector } from "../../redux/HooksWrapper";

export default function FilterTab() {
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const client = useTypedSelector(state => state.connectionState.client);

    const [keyspaces, setKeyspaces] = useState<string[]>([]);
    const [tables, setTables] = useState<string[]>([]);
    const [currentSpace, setCurrentSpace] = useState<string>('');
    const [currentTable, setCurrentTable] = useState<string>('');

    return isConnected ? <Box>
        <Group>

        </Group>
    </Box>
    :
    <Center style={{width: '100%', height: '100%'}}>
        <Text color={theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.dark[4]}>未连接</Text>
    </Center>
}