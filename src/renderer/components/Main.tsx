import { Navigate, useSearchParams } from 'react-router-dom';
import { ActionIcon, AppShell, BackgroundImage, Center, Container, Header, Image, ThemeIcon } from '@mantine/core';
import Sidebar from './Sidebar';
import CassandraLogo from '../assets/CassandraLogo.svg';

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
                            mt: 12,
                            height: 'calc(100vh - 20px)',
                            style: {
                                backgroundColor: '#FAFBFC'
                            }
                        }}
                    />
                }
            >
                <Center style={{width: '100%', height: '100%'}}>
                    <Image src={CassandraLogo} alt="cassandra-shake" />
                </Center>
                {/* <Panel /> */}
            </AppShell>
        </div>

    );
}
