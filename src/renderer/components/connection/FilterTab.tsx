import { Textarea, useMantineTheme, Box, Center, Text, Group, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import CassandraUtil from "../../util/CassandraUtil";

import { useTypedSelector } from "../../redux/HooksWrapper";
import FilterCondition from "./FilterCondition";

export default function FilterTab() {
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const client = useTypedSelector(state => state.connectionState.client);

    const [resultRows, setResultRows] = useState<Record<string, any>[]>([]);
    const [executing, setExecuting] = useState(false);
    const [execResultType, setExecResultType] = useState<'table' | 'message'>('message');

    const [keyspaces, setKeyspaces] = useState<string[]>([]);
    const [tables, setTables] = useState<string[]>([]);
    const [currentSpace, setCurrentSpace] = useState<string>('');
    const [currentTable, setCurrentTable] = useState<string>('');

    const initialKeyspaces = async () => {
        const dbs = await CassandraUtil.getKeyspaces(client!);
        setKeyspaces(dbs);
        if (dbs.includes('iot')) {
            setCurrentSpace('iot');
        }
    }

    useEffect(() => {
        initialKeyspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!currentSpace || !client) {
            setCurrentTable('');
            setTables([]);
        } else {
            CassandraUtil.getTables(client!, currentSpace).then(t => {
                setTables(t);
                if (t.length) {
                    setCurrentTable(t[0]);
                } else {
                    setCurrentTable("");
                }
            });
        }
    }, [currentSpace, client]);

    return isConnected ? <Box pt={8} pl={8} pr={8} pb={8}>
        <Group>
            <Select
                label="Keyspace"
                placeholder="选择数据库"
                onChange={value => setCurrentSpace(value!)}
                value={currentSpace}
                data={keyspaces.map(k => ({
                    value: k,
                    label: k
                }))}
            />
            <Select
                label="Table"
                placeholder="选择表"
                onChange={value => setCurrentTable(value!)}
                value={currentTable}
                data={tables.map(t => ({
                    value: t,
                    label: t
                }))}
            />
        </Group>
        <Box
            mt={10}
            style={{
                width: "100%",
                height: 200,
                overflow: 'auto',
                padding: 5,
                border: 1,
                borderStyle: 'solid',
                borderColor: '#228be6'
            }}>
            <FilterCondition keyspace={currentSpace} table={currentTable} />
        </Box>
    </Box>
    :
    <Center style={{width: '100%', height: '100%'}}>
        <Text color={theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.dark[4]}>未连接</Text>
    </Center>
}