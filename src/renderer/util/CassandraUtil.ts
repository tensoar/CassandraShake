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
}