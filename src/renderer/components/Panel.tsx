import { Button, Grid, Group, useMantineTheme, Text } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Tabs, {TabPane} from 'rc-tabs';

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
                    <Tabs
                        defaultActiveKey='1'
                        tabPosition='top'
                        renderTabBar={(props, DefaultTabBar) => {
                            return <DefaultTabBar
                                {...props}
                                style={{
                                    height: 200
                                }}
                            />
                        }}
                    >
                        <TabPane
                            tab={<Text>Home</Text>}
                            key="1"
                        >
                            <OverviewTab />
                        </TabPane>
                        <TabPane tab="Command" key="2">
                            <OverviewTab />
                        </TabPane>
                        <TabPane tab="Filter" key="3">
                            <OverviewTab />
                        </TabPane>
                    </Tabs>
                    {/* {tabKey === 'tab-overview' && <OverviewTab />}
                    {tabKey === 'tab-command' && <CommandTab />}
                    {tabKey === 'tab-filter' && <FilterTab />} */}
                    {/* <Tabs
                    >
                        <Tabs.Tab
                            key="tab-overview"
                            label="Home"
                            icon={<Home size={14} />}
                        >
                            <OverviewTab />
                        </Tabs.Tab>
                        <Tabs.Tab
                            key="tab-coomand"
                            label="Command"
                            icon={<Command size={14} />}
                        >
                            <CommandTab />
                        </Tabs.Tab>
                        <Tabs.Tab
                            key="tab-filter"
                            label="Filter"
                            icon={<Command size={14} />}
                        >
                            <FilterTab />
                        </Tabs.Tab>
                    </Tabs> */}
                </Grid.Col>
                <Grid.Col span={isConnected ? 6 : 0}>
                    <DatabaseTree />
                </Grid.Col>
            </Grid>
        </div>
    );
}
