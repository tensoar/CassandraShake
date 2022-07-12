import { Center, useMantineTheme, Text } from "@mantine/core";
import MonacoEditor from "react-monaco-editor";
import { useEffect, useRef, useState } from "react";
import { editor as OriginMonacoEditor } from 'monaco-editor';

import { useTypedSelector } from "../../redux/HooksWrapper";

export default function CommandTab() {
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const [cqlCode, setCqlCode] = useState('');
    const [cqlEditor, setCqlEditor] = useState<OriginMonacoEditor.IStandaloneCodeEditor | null>(null);
    const editorRef = useRef<OriginMonacoEditor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        editorRef.current = cqlEditor;
    }, [cqlEditor]);

    useEffect(() => {
        window.addEventListener('resize', () => {
            const editor = editorRef.current;
            if (editor !== null) {
                editor.layout();
            }
        });
    }, []);

    return isConnected ? <div style={{width: '100%', height: '100%'}}>
        <Center style={{width: '100%', height: '100%', paddingTop: 10}}>
            <MonacoEditor
                width='96%'
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