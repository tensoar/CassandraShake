import { Navigate, useSearchParams } from 'react-router-dom';
import { ActionIcon, AppShell, Center, Container, Header, ThemeIcon } from '@mantine/core';
import { Database } from 'tabler-icons-react';

import Panel from './Panel';
import Sidebar from './Sidebar';

export default function Main() {

    console.log("cccc");
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
                            width: { base: 280 },
                            height: 'calc(100vh - 20px)',
                        }}
                    />
                }
            >
                {/* <Panel /> */}
            </AppShell>
        </div>

    );
}
