import { Client as CassandraClient } from "cassandra-driver";

import CassandraInfo from "../../main/entity/CassandraInfo";
import DateUtil from "./DateUtil";

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
}