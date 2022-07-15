import { Badge, Button, Card, Grid, Group, Input, InputWrapper, Select, Text, TextInput } from "@mantine/core";
import { useState } from "react";

export default function DfuSubTaskForm(props: {add: (name: string) => void}) {
    const [name, setName] = useState("");
    return (<Card shadow="sm" p="sm" style={{ marginTop: 20, paddingBottom: 20 }}>
        <Group position="apart">
            <Text weight={500}>升级测试</Text>
            <Button  compact color="pink" variant="light">
                删除
            </Button>
            <Grid>
                <Grid.Col span={6}>
                    <InputWrapper label="子任务名称">
                        <TextInput value={name} onChange={(event) => setName(event.currentTarget.value)} />
                    </InputWrapper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        label="协议类型"
                        placeholder="协议类型"
                        data={[
                            { value: '1', label: '698' },
                            { value: '2', label: '645' },
                        ]}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        label="模块厂商"
                        placeholder="模块厂商"
                        data={[
                            { value: '1', label: '厂商1' },
                            { value: '2', label: '厂商2' },
                        ]}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        label="模块"
                        placeholder="模块"
                        data={[
                            { value: '1', label: '模块1' },
                            { value: '2', label: '模块2' },
                        ]}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        label="工装"
                        placeholder="选择工装"
                        data={[
                            { value: '1', label: 'DCB161211' },
                            { value: '2', label: 'YTDTGD2JD' },
                        ]}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        label="插槽"
                        placeholder="选择插槽"
                        data={[
                            { value: '1', label: '插槽1' },
                            { value: '2', label: '插槽2' },
                        ]}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <Select
                        label="升级文件"
                        placeholder="选择升级文件"
                        data={[
                            { value: '1', label: 'V1.1.1' },
                            { value: '2', label: 'V2.2.2' },
                        ]}
                    />
                </Grid.Col>
                <Grid.Col span={6}>
                    <InputWrapper label="块传输大小(字节)">
                        <Input />
                    </InputWrapper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <InputWrapper label="下载方标识">
                        <Input />
                    </InputWrapper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <InputWrapper label="兼容的硬件版本号">
                        <Input />
                    </InputWrapper>
                </Grid.Col>
                <Grid.Col span={6}>
                    <InputWrapper label="兼容的软件版本号">
                        <Input />
                    </InputWrapper>
                </Grid.Col>
            </Grid>
        </Group>
        <Button onClick={() => props.add(name)} variant="light" color="blue" fullWidth style={{ marginTop: 14 }}>
          添加
        </Button>
    </Card>)
}
