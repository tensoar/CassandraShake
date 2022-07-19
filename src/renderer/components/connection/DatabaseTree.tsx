import { Accordion, List, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { CirclePlus, Columns, Database, Key, Table as TableIcon } from "tabler-icons-react";
import { useTypedDispath, useTypedSelector } from "../../redux/HooksWrapper";
import Sidebar from "../Sidebar";

interface ColumnInfo {
    name: string,
    type: any,
    isClusteringKeys: boolean,
    isPartitionKey: boolean,
}

interface TableInfo {
    name: string;
    colums: ColumnInfo[];
}

interface KeyspaceInfo {
    name: string,
    tables: TableInfo[]
}

export default function DatabaseTree() {
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const cassandraClient = useTypedSelector(state => state.connectionState.client);
    const [keyspaces, setKeyspaces] = useState<KeyspaceInfo[]>([]);


    const scanColumnsOfTable = async (keyspaceName: string, tableName: string) => {
        const table = await cassandraClient?.metadata.getTable(keyspaceName, tableName);
        const partitionKeys = table?.partitionKeys.map(p => p.name) as string[];
        const clusterKeys = table?.clusteringKeys.map(c => c.name) as string[];
        const colums: ColumnInfo[] = table?.columns.map(col => ({
            name: col.name,
            type: col.type.code,
            isClusteringKeys: clusterKeys.includes(col.name),
            isPartitionKey: partitionKeys.includes(col.name)
        })) as ColumnInfo[];
        return colums;
    }

    const scanTablesOfKeypsace = async(keyspaceName: string) => {
        const spaceInfo: KeyspaceInfo = {
            name: keyspaceName,
            tables: []
        };
        const tableNames = await cassandraClient?.execute(`SELECT table_name FROM system_schema.tables WHERE keyspace_name = '${keyspaceName}'`);
        if (tableNames === undefined) {
            return spaceInfo;
        }
        console.log('tableNames = ', tableNames);
        const tableInfos: TableInfo[] = tableNames.rows.map(r => ({name: r.table_name, colums: []}));
        spaceInfo.tables = tableInfos;
        console.log('tableInfos = ', tableInfos);
        // eslint-disable-next-line no-restricted-syntax
        for (const tInfo of tableInfos) {
            // eslint-disable-next-line no-await-in-loop
            tInfo.colums = await scanColumnsOfTable(keyspaceName, tInfo.name);
            // eslint-disable-next-line no-nested-ternary
            tInfo.colums.sort((a, b) => b.isPartitionKey ? 2 : (b.isClusteringKeys ? 1 : 0) - (a.isPartitionKey ? 2 : (a.isClusteringKeys ? 1 : 0)));
        }
        return spaceInfo;
    }

    const scanKeyspaces = async () => {
        console.log(keyspaces)
        if (cassandraClient == null) {
            return;
        }
        const metaKeyspaces = cassandraClient?.metadata.keyspaces as {[key: string]: any};
        const dbs: KeyspaceInfo[] = [];
        for (const key of Object.keys(metaKeyspaces)) {
            dbs.push(await scanTablesOfKeypsace(key));
        }
        setKeyspaces(__ => dbs);
        return dbs;
    }

    const getColumnIcon = (column: ColumnInfo) => {
        if (column.isPartitionKey) {
            return <Key size={16} color={theme.colors.orange[6]} />
        } else if (column.isClusteringKeys) {
            return <Key size={16} color={theme.colors.green[6]} />
        } else {
            return <Columns size={16} color={theme.colors.grape[5]} />
        }
    }

    useEffect(() => {
        scanKeyspaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cassandraClient]);

    return isConnected ?
    <div>
        <Accordion
            icon={<Database size={16} />}
            multiple
        >
            {keyspaces?.map(keyspace => {
                return <Accordion.Item key={keyspace.name} label={keyspace.name}>
                    <Accordion icon={<TableIcon size={16} />} multiple>
                        {keyspace.tables.map(table => {
                            return <Accordion.Item key={table.name} label={table.name}>
                                <List>
                                    {table.colums.map(column => {
                                        return <List.Item icon={getColumnIcon(column)} key={column.name}>
                                            {column.name}
                                        </List.Item>
                                    })}
                                </List>
                            </Accordion.Item>
                        })}
                    </Accordion>
                </Accordion.Item>
            })}
        </Accordion>
    </div>
    :
    <></>
}