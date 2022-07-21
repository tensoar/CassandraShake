import { Button, Grid, Group, useMantineTheme, Text, Divider, Box } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import Tabs, {TabPane} from 'rc-tabs';

import { Command, Container, Home, Leaf, Terminal } from 'tabler-icons-react';

import { useTypedDispath, useTypedSelector } from '../redux/HooksWrapper';

import OverviewTab from './connection/OviewViewTab';
import CommandTab from './connection/CommandTab';
import FilterTab from './connection/FilterTab';
import DatabaseTree from './connection/DatabaseTree';
import { setConnectionIdAction } from '../redux/reducer/ConnectionReducer';
import ThemeUtil from '../util/ThemeUtil';

// import 'rc-tabs/assets/index.css'

export default function Panel() {
    const [searchParams] = useSearchParams();
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const connectionId = parseInt(searchParams.get('connectionId') || '0', 10);
    const dispatch = useTypedDispath();
    dispatch(setConnectionIdAction(connectionId));
    const [currentTabKey, setCurrentTabKey] = useState('1');

    const getTabButtonColor = (key: string) => {
        if (theme.colorScheme === 'dark') {
            return key === currentTabKey ? 'default' : 'gray'
        }
        return key === currentTabKey ? 'default' : 'dark';
    }

    return (
        <Box
            style={{ height: '100vh', width: '100%'}}
        >
            <Grid
                columns={24}
                style={{
                    height: '100%',
                    width: '100%',
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                    opacity: 1,
                }}
            >
                <Grid.Col
                    span={isConnected ? 18 : 24}
                    style={{
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Box
                        style={{
                            borderBottomStyle: 'solid',
                            borderWidth: 1,
                            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3]
                        }}
                    >
                        <Group
                            spacing='xs'
                            style={{
                                // borderBottom: 2,
                                // borderBottomColor: 'blue'
                            }}
                        >
                            <Button
                                onClick={() => setCurrentTabKey('1')}
                                variant="subtle"
                                color={getTabButtonColor('1')}
                                leftIcon={<Home size={16} />}
                                style={{
                                    borderBottomStyle: 'solid',
                                    borderTopWidth: 0,
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    borderBottomWidth: currentTabKey === '1' ? 2 : 0,
                                    borderColor: theme.colors.blue[3],
                                    borderRadius: 0
                                }}
                            >
                                Home
                            </Button>
                            <Button
                                onClick={() => setCurrentTabKey('2')}
                                variant="subtle"
                                color={getTabButtonColor('2')}
                                leftIcon={<Terminal size={16} />}
                                style={{
                                    borderBottomStyle: 'solid',
                                    borderTopWidth: 0,
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    borderBottomWidth: currentTabKey === '2' ? 2 : 0,
                                    borderColor: theme.colors.blue[3],
                                    borderRadius: 0
                                }}
                            >
                                Command
                            </Button>
                            <Button
                                onClick={() => setCurrentTabKey('3')}
                                variant="subtle"
                                color={getTabButtonColor('3')}
                                leftIcon={<Leaf size={15} />}
                                style={{
                                    borderBottomStyle: 'solid',
                                    borderTopWidth: 0,
                                    borderRightWidth: 0,
                                    borderLeftWidth: 0,
                                    borderBottomWidth: currentTabKey === '3' ? 2 : 0,
                                    borderColor: theme.colors.blue[3],
                                    borderRadius: 0
                                }}
                            >
                                Filter
                            </Button>
                        </Group>
                    </Box>
                    <Tabs
                        defaultActiveKey='1'
                        tabPosition='top'
                        activeKey={currentTabKey}
                        renderTabBar={(props, DefaultTabBar) => {
                            return <></>
                        }}
                        style={{
                            paddingTop: 10,
                            paddingRight: 10,
                        }}
                    >
                        <TabPane
                            tab={<Text
                                size='md'
                                color={ThemeUtil.defaultFontColor(theme)}
                                style={{
                                    backgroundColor: ThemeUtil.defaultBackgroudColor(theme),
                                    borderWidth: 0
                                }}
                            >
                                Home
                            </Text>}
                            key="1"
                        >
                            <OverviewTab />
                        </TabPane>
                        <TabPane
                            tab={<Text>Command</Text>}
                            key="2"
                        >
                            <CommandTab />
                        </TabPane>
                        <TabPane
                            tab={<Text>Filter</Text>}
                            key="3"
                        >
                            <FilterTab />
                        </TabPane>
                    </Tabs>
                </Grid.Col>
                <Grid.Col
                    span={isConnected ? 6 : 0}
                    style={{
                        height: '100%',
                        overflow: 'auto',
                        width: '90%',
                        borderWidth: 1,
                        borderTopWidth: 0,
                        borderRightWidth: 0,
                        borderBottomWidth: 0,
                        borderStyle: 'solid',
                        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3],
                    }}
                    sx={th => ({
                        // scrollbarWidth: "thin",
                        '::-webkit-scrollbar': {
                            width: '14px',
                            height: '8px',
                        },
                        '::-webkit-scrollbar-corner': {
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4]: theme.colors.blue[0]
                        },
                        "::-webkit-scrollbar-thumb": {
                            // 滚动条
                            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7]: theme.colors.gray[4],
                            borderRadius: 20
                        },
                        '::-webkit-scrollbar-track': {
                            // 滚动区域
                            background: theme.colorScheme === 'dark' ? theme.colors.dark[4]: theme.colors.blue[0],
                            borderRadius: 20
                         }
                    })}
                >
                    <DatabaseTree />
                </Grid.Col>
            </Grid>
        </Box>
    );
}
