import { Client as CassandraClient, Client } from "cassandra-driver";
import _ from "lodash";

import CassandraInfo from "../../main/entity/CassandraInfo";
import DateUtil from "./DateUtil";
import { KeyspaceInfo, ColumnInfo, TableInfo } from './TypeUtil';

export default class CassandraUtil {
    static async doConnection(cassandraInfo: CassandraInfo) {
        try {
            const client = new CassandraClient({
                contactPoints: cassandraInfo.hosts.split(','),
                localDataCenter: cassandraInfo.datacenter,
                credentials: {
                    username: cassandraInfo.username || "iot",
                    password: cassandraInfo.password || "iotdev"
                }
            });
            await client.connect();
            return client;
        } catch (e) {
            console.log(e);
            console.log("连接失败");
            return null;
        }
    }

    static async executeCql(client: CassandraClient, cqlStr: string): Promise<Record<string, any>[] | boolean> {
        const cql = cqlStr.split('\n').filter(s => !s.trim().startsWith('--')).join('\n');
        const cqls = cql.split(';').map(c => c.trim()).filter(c => c.length > 0);
        let result;
        let lastCql;
        for (const c of cqls) {
            result = await client.execute(c.replace(";", '').trim());
            lastCql = c;
            console.log('result = ', result);
        }
        if (lastCql?.toLocaleLowerCase().startsWith('select')) {
            return (result?.rows || []).map(row => {
                const record: Record<string, any> = [];
                for (const key of row.keys()) {
                    const v = row[key];
                    if (v === null || v === undefined) {
                        record[key] = null;
                    }
                    if (v instanceof Date) {
                        record[key] = DateUtil.date2Ts(v);
                    } if (v instanceof Set || v instanceof Map || v instanceof Array) {
                        record[key] = JSON.stringify(v);
                    } else if (typeof v === 'object') {
                        record[key] = JSON.stringify(v);
                    } else {
                        record[key] = v;
                    }
                }
                return record;
            });
        } else {
            return true;
        }
    }

    static async getKeyspaces(client: CassandraClient): Promise<string[]> {
        const keyspaces: string[] = [];
        try {
            if (_.isNil(client)) {
                return keyspaces;
            }
            const metaKeyspaces = client.metadata.keyspaces as {[key: string]: any};
            for (const key of Object.keys(metaKeyspaces)) {
                keyspaces.push(key);
            }
            return keyspaces;
        } catch(e) {
            console.log(e)
        }
        return keyspaces;
    }

    static async getTables(client: CassandraClient, keyspace: string) {
        const tableNames = await client?.execute(`SELECT table_name FROM system_schema.tables WHERE keyspace_name = '${keyspace}'`);
        if (_.isNil(tableNames)) {
            return [];
        }
        return tableNames.rows.map(r => r.table_name);
    }

    static typeCode = {
        0x0000: 'custom',
        0x0001: 'ascii',
        0x0002: 'bigint',
        0x0003: 'blob',
        0x0004: 'boolean',
        0x0005: 'counter',
        0x0006: 'decimal',
        0x0007: 'double',
        0x0008: 'float',
        0x0009: 'int',
        0x000a: 'text',
        0x000b: 'timestamp',
        0x000c: 'uuid',
        0x000d: 'varchar',
        0x000e: 'varint',
        0x000f: 'timeuuid',
        0x0010: 'inet',
        0x0011: 'date',
        0x0012: 'time',
        0x0013: 'smallint',
        0x0014: 'tinyint',
        0x0020: 'list',
        0x0021: 'map',
        0x0022: 'set',
        0x0030: 'udt',
        0x0031: 'tuple',
    }

    static getTypeNameByCode(code: number) {
        return this.typeCode[code as keyof typeof this.typeCode];
    }
}