import React, { useState } from 'react';
import { ActionIcon, AppShell, Center, Container, Header, ThemeIcon } from '@mantine/core';
import { Database } from 'tabler-icons-react';

import Panel from './Panel';
import Sidebar from './Sidebar';

export default function Main() {
    return (
        <div>
            <AppShell
                style={{ height: 'calc(100vh - 20px)' }}
                padding="md"
                // header={
                //     <Header height={40}>
                //         <Center inline>
                //             <ActionIcon title="新建数据库连接">
                //                 <Database />
                //             </ActionIcon>
                //         </Center>
                //     </Header>
                // }
                navbar={
                    <Sidebar
                        nav={{
                            width: { base: 300 },
                            height: 'calc(100vh - 20px)',
                        }}
                    />
                }
            >
                <Container style={{ height: '100%' }}>
                    <Panel />
                </Container>
            </AppShell>
        </div>
    );
}
