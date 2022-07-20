import { Client as CassandraClient } from "cassandra-driver";

import CassandraInfo from "../../main/entity/CassandraInfo";

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

    static async executeCql(client: CassandraClient, cqlStr: string) {
        const cql = cqlStr.split('\n').filter(s => !s.trim().startsWith('--')).join('\n');
        const cqls = cql.split(';').map(c => c.trim()).filter(c => c.length > 0);
        let result;
        for (const c of cqls) {
            console.log(c)
            result = await client.execute(c.replace(";", '').trim());
        }
        return result?.rows || [];
    }
}