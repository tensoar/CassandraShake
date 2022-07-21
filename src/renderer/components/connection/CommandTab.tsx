import { Center, useMantineTheme, Text, Button, Group, UnstyledButton, Badge, Slider, Box, Stack } from "@mantine/core";
import MonacoEditor from "react-monaco-editor";
import { useEffect, useRef, useState } from "react";
import { editor as OriginMonacoEditor } from 'monaco-editor';
import { Ballon, Run } from "tabler-icons-react";
import { types } from "cassandra-driver";

import { useTypedSelector } from "../../redux/HooksWrapper";
import CassandraUtil from "../../util/CassandraUtil";
import PaginationTable from "./PaginationTable";

export default function CommandTab() {
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const client = useTypedSelector(state => state.connectionState.client);
    const [cqlCode, setCqlCode] = useState('');
    const [cqlEditor, setCqlEditor] = useState<OriginMonacoEditor.IStandaloneCodeEditor | null>(null);
    const editorRef = useRef<OriginMonacoEditor.IStandaloneCodeEditor | null>(null);
    const [resultRows, setResultRows] = useState<Record<string, any>[]>([]);
    const [executeErr, setExecuteErr] = useState<any | null>(null);
    const [executing, setExecuting] = useState(false);
    const [execResultType, setExecResultType] = useState<'table' | 'message'>('table');
    const [execResultMessage, setExecResultMessage] = useState('');

    useEffect(() => {
        editorRef.current = cqlEditor;
    }, [cqlEditor]);

    useEffect(() => {
        const resizeEditor = () => {
            const editor = editorRef.current;
            if (editor !== null) {
                editor.layout();
            }
        };

        window.addEventListener('resize', resizeEditor);

        return () => {
            window.removeEventListener('resize', resizeEditor);
        };
    }, []);

    const executeCql = async () => {
        if (client == null) {
            return;
        }
        const cql = editorRef.current?.getValue();
        if (!cql) {
            return;
        }
        setExecuting(true);
        try {
            const rows = await CassandraUtil.executeCql(client, cql);
            if (typeof rows === 'boolean') {

            } else {
                setResultRows(__ => rows);
                console.log('rows = ', rows);
            }
            setExecuteErr(null);
        } catch (e) {
            console.log(e);
            setResultRows(__ => []);
            setExecuteErr(e);
        } finally {
            setExecuting(false);
        }
    }

    return isConnected ? <Stack spacing="sm" style={{width: '100%', height: '100%', paddingLeft: 10, paddingRight: 10}}>
        <Group ml={10}>
            <Button
                compact
                variant={theme.colorScheme === "dark" ? "light" : "filled"}
                color="teal"
                radius="lg"
                size="xs"
                leftIcon={<Run size={14} />}
                onClick={executeCql}
                disabled={executing}
                loading={executing}
            >
                Execute
            </Button>
            <Button
                compact
                variant={theme.colorScheme === "dark" ? "light" : "filled"}
                color="teal"
                radius="lg"
                size="xs"
                leftIcon={<Ballon size={14} />}
            >
                Export
            </Button>
        </Group>
        <Center style={{width: '100%', paddingTop: 10}}>
            <MonacoEditor
                width='100%'
                height={260}
                language="sql"
                theme={theme.colorScheme === "dark" ? "vs-dark" : "vs-light"}
                value={cqlCode}
                options={{
                    fontSize: 18
                }}
                editorDidMount={setCqlEditor}
                onChange={(newValue, e) => setCqlCode(newValue)}
            />
        </Center>
        <Box
            pb={10}
            style={{
                width: '100%',
                height: 500,
                // overflow: 'auto',
            }}
        >
            <PaginationTable
                rows={resultRows}
                error={executeErr}
            />
        </Box>
    </Stack>
    :
    <Center style={{width: '100%', height: '100%'}}>
        <Text color={theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.dark[4]}>未连接</Text>
    </Center>
}