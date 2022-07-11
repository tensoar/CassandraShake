import { Button, Center, Input, InputWrapper, Stack } from "@mantine/core";
import { ipcRenderer } from "electron";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import CassandraInfo from "../../main/entity/CassandraInfo";
import ConstantUtil from "../../main/util/ConstantUtil";
import LocalStorageIpc from "../storage/LocalStorageIpc";

export default function AddConnection() {
    const [connName, setConnName] = useState("");
    const [connHost, setConnHost] = useState("");
    const [connDatacenter, setConnDatacenter] = useState("datacenter1");

    const addConnection = () => {
        const info = new CassandraInfo();
        info.id = new Date().getTime();
        info.datacenter = connDatacenter;
        info.hosts = connHost;
        info.name = connName;
        LocalStorageIpc.addConnection(info);
        // alert(JSON.stringify(info))
        ipcRenderer.send(ConstantUtil.ActionChennel.CLOSE_ADD_CONNECTION_WIN);
    }

    return <Center pt={30} style={{width: '100%', height: '100%'}}>
        <Stack style={{width: '80%'}}>
            <InputWrapper
                label="名称"
                description="连接名称, 随便起, 方便自己记忆"
            >
                <Input
                    id='connectionName'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConnName(e.currentTarget.value)}
                    placeholder="数据库名称" />
            </InputWrapper>
            <InputWrapper
                label="地址"
                description="数据库地址, ip加端口号, 例: 192.168.18.11:9042, 若为集群, 多个地址间英文逗号隔开, 例: 192.168.18.223:9042,192.168.18.224:9042,192.168.18.224:9042"
            >
                <Input
                    id='connectionName'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConnHost(e.currentTarget.value)}
                    placeholder="数据库地址" />
            </InputWrapper>
            {/* <InputWrapper
                label="数据中心"
            >
                <Input
                    id='connectionName'
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConnDatacenter(e.currentTarget.value)}
                    placeholder="数据中心名称" />
            </InputWrapper> */}
            <Button mt={20} onClick={addConnection}>确 定</Button>
        </Stack>
    </Center>
}