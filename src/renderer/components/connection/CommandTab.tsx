import { Center, useMantineTheme, Text, Button, Group, UnstyledButton, Badge } from "@mantine/core";
import MonacoEditor from "react-monaco-editor";
import { useEffect, useRef, useState } from "react";
import { editor as OriginMonacoEditor } from 'monaco-editor';
import { Ballon, Run } from "tabler-icons-react";

import { useTypedSelector } from "../../redux/HooksWrapper";

export default function CommandTab() {
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const client = useTypedSelector(state => state.connectionState.client);
    const [cqlCode, setCqlCode] = useState('22');
    const [cqlEditor, setCqlEditor] = useState<OriginMonacoEditor.IStandaloneCodeEditor | null>(null);
    const editorRef = useRef<OriginMonacoEditor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        editorRef.current = cqlEditor;
    }, [cqlEditor]);

    useEffect(() => {
        console.log("mounted ...")
        const resizeEditor = () => {
            const editor = editorRef.current;
            if (editor !== null) {
                editor.layout();
            }
        };

        window.addEventListener('resize', resizeEditor);

        return () => {
            window.removeEventListener('resize', resizeEditor);
            console.log("un mounted ...")
        };
    }, []);

    return isConnected ? <div style={{width: '100%', height: '100%', paddingLeft: 10, paddingRight: 10}}>
        <Group ml={10}>
            <Button
                compact
                variant={theme.colorScheme === "dark" ? "light" : "filled"}
                color="teal"
                radius="lg"
                size="xs"
                leftIcon={<Run size={14} />}
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
    </div>
    :
    <Center style={{width: '100%', height: '100%'}}>
        <Text color={theme.colorScheme === 'dark' ? theme.colors.gray[6] : theme.colors.dark[4]}>未连接</Text>
    </Center>
}