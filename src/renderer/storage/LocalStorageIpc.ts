import { ipcRenderer } from "electron";
import CassandraInfo from "../../main/entity/CassandraInfo";
import ConstantUtil from "../../main/util/ConstantUtil";

const StorageChannelConst = ConstantUtil.StorageIpcChannel;

export default class LocalStorageIpc {
    static async addConnection(conn: CassandraInfo): Promise<CassandraInfo> {
        return ipcRenderer.invoke(StorageChannelConst.ADD_CONNECTION, conn);
    }

    static async updateConnection(id: number, cond: Partial<CassandraInfo>): Promise<number> {
        return ipcRenderer.invoke(StorageChannelConst.UPDATE_CONNECTION, id, cond);
    }

    static async deleteConnection(id: number): Promise<number> {
        return ipcRenderer.invoke(StorageChannelConst.DELETE_CONNECTION, id);
    }

    static async findOneConnection(cond: Partial<CassandraInfo>): Promise<CassandraInfo | null> {
        return ipcRenderer.invoke(StorageChannelConst.FIND_ONE_CONNECTOIN, cond);
    }

    static async findManyConnection(cond?: Partial<CassandraInfo>): Promise<CassandraInfo[] | null> {
        return ipcRenderer.invoke(StorageChannelConst.FIND_MANY_CONNECTION, cond || {});
    }
}