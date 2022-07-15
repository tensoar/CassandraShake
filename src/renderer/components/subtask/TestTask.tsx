import { Accordion, AppShell, Button, Center, Divider, Grid, Group, Image, InputWrapper, Navbar, ScrollArea, Select, Space, Tabs, TextInput, Text, Badge, Loader, Table, List, ThemeIcon } from "@mantine/core";
import { DateRangePicker } from '@mantine/dates';
import { ReactNode, useState } from "react";
import { Box, CircleCheck, CircleDashed, MessageCircle, Photo, Settings } from "tabler-icons-react";
import DfuSubTaskForm from "./DFUTaskForm";
import FreezeSubTaskForm from "./FreezeSubTaskForm";

export default function TestTask() {
    const [subTaskForm, setSubTaskForm] = useState<JSX.Element>([]);
    const [subTaskTypeValue, setSubtaskTypeValue] = useState<string | null>("");
    const [filterType, setFilterType] = useState<string | null>("time");
    const [subTaskList, setSubTaskList] = useState<Array<{type: number, name: string}>>([]);
    const [currentSubtakName, setCurrentSubTaskName] = useState("");
    const subTasks = [{
        companyName: '厂商1',
        modleName: '模块1',
        type: '升级测试',
        toolingSN: 'UYHJTYG3',
        slotIndex: 1,
        status: 1,
        name: '子任务1',
        startTime: '2022-01-01 02:33:22',
        endTime: '2022-03-02 02:33:22',
        spendTimes: 2222,
        protocolType: '698',
    }, {
        companyName: '厂商2',
        modleName: '模块2',
        type: '冻结测试',
        toolingSN: 'UYHJTYG3',
        slotIndex: 1,
        status: 2,
        name: '子任务2',
        startTime: '2022-01-01 02:33:22',
        endTime: '2022-03-02 02:33:22',
        spendTimes: 2222,
        protocolType: '645',
    }, {
        companyName: '厂商2',
        modleName: '模块2',
        type: '升级测试',
        toolingSN: 'UYHJTYG3',
        slotIndex: 1,
        status: 2,
        name: '子任务3',
        startTime: '2022-01-01 02:33:22',
        endTime: '2022-03-02 02:33:22',
        spendTimes: 2222,
        protocolType: '698',
    }]

    const addSubTask = () => {
        if (subTaskTypeValue === "1") {
            setSubTaskForm(__ => <FreezeSubTaskForm add={name => setSubTaskList(l => [...l, {type: 1, name}])} />)
        } else {
            setSubTaskForm(__ => <DfuSubTaskForm add={name => setSubTaskList(l => [...l, {type: 2, name}])} />)
        }
    }

    return <div style={{height: '100%', width: '100%'}}>
        <AppShell
            sx= {theme => ({
                background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                paddingLeft: 20,
                paddingTop: 20
            })}
            padding="md"
            navbar={
                <Navbar
                    width={{ base: '30%' }}
                    sx={theme => ({
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                        paddingRight: 20
                    })}
                >
                    <Grid>
                        <Grid.Col span={6}>
                            <InputWrapper label="任务名称">
                                <TextInput />
                            </InputWrapper>
                        </Grid.Col>
                        <Grid.Col span={6}>
                            <Select
                                label="优先级"
                                placeholder="优先级"
                                data={[
                                    { value: '1', label: '高' },
                                    { value: '2', label: '低' },
                                ]}
                            />
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Select
                                label="添加子任务"
                                placeholder="选择子任务类型"
                                value={subTaskTypeValue}
                                onChange={setSubtaskTypeValue}
                                rightSection={<Button onClick={addSubTask}>添加</Button>}
                                data={[
                                    { value: '1', label: '冻结测试' },
                                    { value: '2', label: '升级测试' },
                                ]}
                            />
                        </Grid.Col>
                        <List
                            mt={10}
                            spacing="xs"
                            size="sm"
                            center
                            icon={
                                <ThemeIcon color="teal" size={24} radius="xl">
                                <CircleCheck size={16} />
                                </ThemeIcon>
                            }
                        >
                            {subTaskList.map(t => (
                                <List.Item
                                    icon={
                                        <ThemeIcon color="blue" size={24} radius="xl">
                                            <CircleDashed size={16} />
                                        </ThemeIcon>
                                    }
                                    onClick={() => {
                                        if (t.type === 1) {
                                            setSubTaskForm(__ => <FreezeSubTaskForm add={name => setSubTaskList(l => [...l, {type: 1, name}])} />)
                                        } else {
                                            setSubTaskForm(__ => <DfuSubTaskForm add={name => setSubTaskList(l => [...l, {type: 2, name}])} />)
                                        }
                                    }}
                                >
                                    {t.name}
                                </List.Item>
                            ))}
                        </List>
                        <Grid.Col span={12}>
                            <Button fullWidth>确定</Button>
                        </Grid.Col>
                    </Grid>
                    <Divider label="子任务配置" style={{marginTop: 20}} />
                    <Space />

                    <Navbar.Section grow pb={20} component={ScrollArea}>
                        {subTaskForm}
                    </Navbar.Section>
                </Navbar>
            }
        >
            <div
                style={{width: '100%', height: '100%'}}
            >
                <Group>
                    <Select
                        label="筛选类型"
                        placeholder="筛选类型"
                        value={filterType}
                        onChange={setFilterType}
                        data={[
                            { value: 'time', label: '时间' },
                            { value: 'name', label: '任务名称' },
                        ]}
                    />
                    {filterType === 'time' ? <DateRangePicker
                        label="选择时间"
                        placeholder="选择时间"
                        />
                        :
                        <InputWrapper label="子任务名称">
                            <TextInput />
                        </InputWrapper>
                    }
                    <Button mt={24}>查询</Button>
                </Group>
                {/* <Divider mt={20} /> */}
                <Tabs mt={20}>
                    <Tabs.Tab label="未完成" icon={<Photo size={14} />}>
                    <Grid columns={24} ml={30}>
                        <Grid.Col span={4}><Text weight={700}>任务名称</Text></Grid.Col>
                        <Grid.Col span={3}><Text weight={700}>任务状态</Text></Grid.Col>
                        <Grid.Col span={3}><Text weight={700}>优先级</Text></Grid.Col>
                        <Grid.Col span={4}><Text weight={700}>开始时间</Text></Grid.Col>
                        <Grid.Col span={4}><Text weight={700}>结束时间</Text></Grid.Col>
                        <Grid.Col span={2}><Text weight={700}>时长(分)</Text></Grid.Col>
                        <Grid.Col span={3}><Text weight={700}>操作</Text></Grid.Col>
                    </Grid>
                        <Accordion >
                            <Accordion.Item
                                label={
                                    <Grid columns={24}>
                                        <Grid.Col span={4}><Text weight={400}>任务1</Text></Grid.Col>
                                        <Grid.Col span={3}><Badge color="teal"><Center><Loader color="teal" size={12} />正在执行</Center></Badge></Grid.Col>
                                        <Grid.Col span={3}><Text weight={400}>高</Text></Grid.Col>
                                        <Grid.Col span={4}><Text weight={400}>2022-07-01 00:00:00</Text></Grid.Col>
                                        <Grid.Col span={4}><Text weight={400}>2022-07-01 00:00:00</Text></Grid.Col>
                                        <Grid.Col span={2}><Text weight={400}>123</Text></Grid.Col>
                                        <Grid.Col span={3}>
                                            <Button variant="subtle" size={12} compact>删除</Button>
                                            <Button variant="subtle" size={12} compact>取消</Button>
                                        </Grid.Col>
                                    </Grid>
                                }
                            >
                                <Table striped highlightOnHover>
                                    <thead>
                                    <tr>
                                        <th>子任务名称</th>
                                        <th>状态</th>
                                        <th>厂商</th>
                                        <th>模块</th>
                                        <th>工装</th>
                                        <th>插槽</th>
                                        <th>协议</th>
                                        <th>开始时间</th>
                                        <th>结束时间</th>
                                        <th>花费时长</th>
                                        <th>操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>{subTasks.map(task => (
                                            <tr key={task.name}>
                                                <td>{task.name}</td>
                                                <td>{task.status === 1 ? <Badge color="teal"><Center><Loader color="teal" size={12} />正在执行</Center></Badge> : <Badge>已完成</Badge>}</td>
                                                <td>{task.companyName}</td>
                                                <td>{task.modleName}</td>
                                                <td>{task.toolingSN}</td>

                                                <td>{task.slotIndex}</td>
                                                <td>{task.protocolType}</td>
                                                <td>{task.startTime}</td>
                                                <td>{task.endTime}</td>
                                                <td>{task.spendTimes}</td>
                                                <td>
                                                    <Button variant="subtle" size={12} compact>删除</Button>
                                                    <Button variant="subtle" size={12} compact>取消</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Item>


                            <Accordion.Item
                                label={
                                    <Grid columns={24}>
                                        <Grid.Col span={4}><Text weight={400}>任务2</Text></Grid.Col>
                                        <Grid.Col span={3}><Badge color="gray"><Center>已取消</Center></Badge></Grid.Col>
                                        <Grid.Col span={3}><Text weight={400}>高</Text></Grid.Col>
                                        <Grid.Col span={4}><Text weight={400}>2022-07-01 00:00:00</Text></Grid.Col>
                                        <Grid.Col span={4}><Text weight={400}>2022-07-01 00:00:00</Text></Grid.Col>
                                        <Grid.Col span={2}><Text weight={400}>123</Text></Grid.Col>
                                        <Grid.Col span={3}>
                                            <Button variant="subtle" size={12} compact>删除</Button>
                                            <Button variant="subtle" size={12} compact>取消</Button>
                                        </Grid.Col>
                                    </Grid>
                                }
                            >
                            <Table striped highlightOnHover>
                                <thead>
                                <tr>
                                    <th>子任务名称</th>
                                    <th>状态</th>
                                    <th>厂商</th>
                                    <th>模块</th>
                                    <th>工装</th>
                                    <th>插槽</th>
                                    <th>协议</th>
                                    <th>开始时间</th>
                                    <th>结束时间</th>
                                    <th>花费时长</th>
                                    <th>操作</th>
                                </tr>
                                </thead>
                                <tbody>{subTasks.map(task => (
                                        <tr key={task.name}>
                                            <td>{task.name}</td>
                                            <td>{task.status === 1 ? <Badge color="teal"><Center><Loader color="teal" size={12} />正在执行</Center></Badge> : <Badge>已完成</Badge>}</td>
                                            <td>{task.companyName}</td>
                                            <td>{task.modleName}</td>
                                            <td>{task.toolingSN}</td>

                                            <td>{task.slotIndex}</td>
                                            <td>{task.protocolType}</td>
                                            <td>{task.startTime}</td>
                                            <td>{task.endTime}</td>
                                            <td>{task.spendTimes}</td>
                                            <td>
                                                <Button variant="subtle" size={12} compact>删除</Button>
                                                <Button variant="subtle" size={12} compact>取消</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </Accordion.Item>
                        </Accordion>
                    </Tabs.Tab>
                    <Tabs.Tab label="等待执行" icon={<MessageCircle size={14} />}>等待执行</Tabs.Tab>
                    <Tabs.Tab label="已结束" icon={<Settings size={14} />}>已结束</Tabs.Tab>
                </Tabs>
            </div>
        </AppShell>
    </div>
}