import { Accordion, Box, Button, Center, List, ThemeIcon, Title, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { CirclePlus, Columns, Database, Key, Plant2, Refresh, Table as TableIcon } from "tabler-icons-react";
import { useTypedDispath, useTypedSelector } from "../../redux/HooksWrapper";
import ThemeUtil from "../../util/ThemeUtil";

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
    const [refreshingTree, setRefreshingThree] = useState(false);


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
        setRefreshingThree(true);
        const dbs: KeyspaceInfo[] = [];
        try {
            if (cassandraClient == null) {
                return;
            }
            const metaKeyspaces = cassandraClient?.metadata.keyspaces as {[key: string]: any};
            for (const key of Object.keys(metaKeyspaces)) {
                dbs.push(await scanTablesOfKeypsace(key));
            }
            setKeyspaces(__ => dbs);
            return dbs;
        } catch(e) {
            console.log(e)
        } finally {
            setRefreshingThree(false);
        }
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
    <Box>
        <Center
            inline
            pt={5}
            pb={5}
            pl={10}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                opacity: 1,
                backgroundColor: ThemeUtil.defaultBackgroudColor(theme),
                width: '100%',
                borderWidth: 1,
                borderBottomStyle: "solid",
                borderBottomColor: ThemeUtil.defaultBorderColor(theme)
            }}
        >
            <ThemeIcon size={16} variant="outline" style={{border: 0}}>
                <Plant2 />
            </ThemeIcon>
            <Title
                ml={10}
                order={5}
                sx={th => ({
                    color: ThemeUtil.defaultFontColor(th),
                    backgroundColor: ThemeUtil.defaultBackgroudColor(th),
                })}
            >
                Keyspaces Tree
            </Title>
            <Button
                ml={5}
                leftIcon={<Refresh size={14} />}
                size="xs"
                variant="outline"
                compact
                onClick={scanKeyspaces}
                disabled={refreshingTree}
                style={{
                    border: 0
                }}
            />
        </Center>
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
    </Box>
    :
    <></>
}