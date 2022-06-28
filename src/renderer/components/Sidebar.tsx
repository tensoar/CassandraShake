import { Navbar, ScrollArea, NavbarProps, Title, ThemeIcon, Center, Accordion, Text } from '@mantine/core';
import _ from 'lodash';
import { Database } from 'tabler-icons-react';
import { Tree } from 'react-arborist';
import React, { Ref } from 'react';
import { NodeRendererProps } from 'react-arborist/dist/types';

function Node({ innerRef, styles, data }: NodeRendererProps<any>) {
    return (
        <div ref={innerRef} style={styles.row}>
            <div style={styles.indent}>{data.name}</div>
        </div>
    );
}

export default function Sidebar(props: { nav: Partial<NavbarProps> }) {

    return (
        <Navbar {...props.nav}>
            <Navbar.Section>
                <Center inline>
                    <ThemeIcon>
                        <Database />
                    </ThemeIcon>
                    <Title order={5} ml={10}>
                        Connections
                    </Title>
                </Center>
            </Navbar.Section>
            <Navbar.Section grow component={ScrollArea}>
                {/* <Accordion disableIconRotation multiple> */}
                {_.fill(Array(50), 2).map((_v, i) => {
                    const data = {
                        id: i.toString(),
                        name: `本地连接${i}`,
                        children: [
                            { id: i, name: i.toString() },
                            { id: i, name: i.toString() },
                        ],
                    };
                    return (
                        <Tree data={data}>{Node}</Tree>
                        // <Accordion.Item
                        //     key={i}
                        //     label={<Text size='md'>{`本地连接${i}`}</Text>}
                        //     icon={
                        //         <ThemeIcon color="violet" variant="light" size={18}>
                        //             <Database  />
                        //         </ThemeIcon>
                        //     }
                        // >
                        //     <h5>本地连接{i}</h5>
                        // </Accordion.Item>
                    );
                })}
                {/* </Accordion> */}
            </Navbar.Section>
        </Navbar>
    );
}
