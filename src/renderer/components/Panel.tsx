import { Grid, Tabs, useMantineTheme } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { Command, Home } from 'tabler-icons-react';

import { useTypedDispath, useTypedSelector } from '../redux/HooksWrapper';

import OverviewTab from './connection/OviewViewTab';
import CommandTab from './connection/CommandTab';
import FilterTab from './connection/FilterTab';
import DatabaseTree from './connection/DatabaseTree';
import { setConnectionIdAction } from '../redux/reducer/ConnectionReducer';

export default function Panel() {
    const [searchParams] = useSearchParams();
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const connectionId = parseInt(searchParams.get('connectionId') || '0', 10);
    const dispatch = useTypedDispath();
    dispatch(setConnectionIdAction(connectionId));

    return (
        <div
            style={{ height: '100vh', width: '100%'}}
        >
            <Grid
                columns={24}
                style={{
                    height: '100%', width: '100%',
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                }}
            >
                <Grid.Col span={isConnected ? 18 : 24}>
                    <Tabs>
                        <Tabs.Tab
                            label="Home"
                            icon={<Home size={14} />}
                        >
                            <OverviewTab />
                        </Tabs.Tab>
                        <Tabs.Tab
                            label="Command"
                            icon={<Command size={14} />}
                        >
                            <CommandTab />
                        </Tabs.Tab>
                        <Tabs.Tab
                            label="Filter"
                            icon={<Command size={14} />}
                        >
                            <FilterTab />
                        </Tabs.Tab>
                    </Tabs>
                </Grid.Col>
                <Grid.Col span={isConnected ? 6 : 0}>
                    <DatabaseTree />
                </Grid.Col>
            </Grid>
        </div>
    );
}
