import { Center, useMantineTheme, Text, Button, Group, UnstyledButton, Badge, Slider } from "@mantine/core";
import MonacoEditor from "react-monaco-editor";
import { useEffect, useRef, useState } from "react";
import { editor as OriginMonacoEditor } from 'monaco-editor';
import { Ballon, Box, Run } from "tabler-icons-react";
import { types } from "cassandra-driver";

import { useTypedSelector } from "../../redux/HooksWrapper";
import CassandraUtil from "../../util/CassandraUtil";

export default function CommandTab() {
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const client = useTypedSelector(state => state.connectionState.client);
    const [cqlCode, setCqlCode] = useState('');
    const [cqlEditor, setCqlEditor] = useState<OriginMonacoEditor.IStandaloneCodeEditor | null>(null);
    const editorRef = useRef<OriginMonacoEditor.IStandaloneCodeEditor | null>(null);
    const [resultRows, setResultRows] = useState<types.Row[]>([]);

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
        try {
            const rows = await CassandraUtil.executeCql(client, cql);
            setResultRows(__ => rows);
            console.log('rows = ', rows);
        } catch (e) {
            console.log(e);
        }
    }

    return isConnected ? <div style={{width: '100%', height: '100%', paddingLeft: 10, paddingRight: 10}}>
        <Group ml={10}>
            <Button
                compact
                variant={theme.colorScheme === "dark" ? "light" : "filled"}
                color="teal"
                radius="lg"
                size="xs"
                leftIcon={<Run size={14} />}
                onClick={executeCql}
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
        {/* <Box
            style={{
                width: '100%'
            }}
        >

        </Box> */}
    </div>
    :
    <Center style={{width: '100%', height: '100%'}}>
        <Text color={theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.dark[4]}>未连接</Text>
    </Center>
}