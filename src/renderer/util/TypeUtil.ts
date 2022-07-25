export interface ColumnInfo {
    name: string,
    type: any,
    isClusteringKey: boolean,
    isPartitionKey: boolean,
}

export interface TableInfo {
    name: string;
    colums: ColumnInfo[];
}

export interface KeyspaceInfo {
    name: string,
    tables: TableInfo[]
}