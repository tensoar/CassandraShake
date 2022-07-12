import path from "path";
import os from "os";
import fs from "fs";
import Database from 'better-sqlite3';
import { BrowserWindow, ipcMain, ipcRenderer } from "electron";
import _ from "lodash";

import CassandraInfo from "../entity/CassandraInfo";
import ConstantUtil from "../util/ConstantUtil";

const STORAGE_FOLDER = path.join(process.env.HOME || process.env.USERPROFILE || os.homedir(), '.cassandra-shake');
if (!fs.existsSync(STORAGE_FOLDER)) {
    fs.mkdirSync(STORAGE_FOLDER, {recursive: true});
}
const dbPath = path.join(STORAGE_FOLDER, 'db');

const db = new Database(dbPath);
db.exec(`
create table if not exists t_connection(
    id integer PRIMARY KEY NOT NULL,
    name varchar(255),
    hosts varchar(65535),
    datacenter varchar(255)
);
`);

export default class LocalStorage {
    static STORAGE_FOLDER = path.join(process.env.HOME || process.env.USERPROFILE || os.homedir(), '.cassandra-shake');

    static addConnection(connection: CassandraInfo) {
        const stmt = db.prepare(`insert into t_connection values(:id, :name, :hosts, :datacenter)`);
        const info = stmt.run(connection);
        connection.id = info.lastInsertRowid.valueOf() as number;
        return connection.id;
    }

    private static genSelectPlaceholders(cond: any) {
        const placeholders: string[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const k of Object.keys(cond)) {
            if (!_.isNil(cond[k])) {
                placeholders.push(`:${k}`);
            }
        }
        return placeholders;
    }

    private static genConditionPlaceholders(cond: any) {
        const placeholders: string[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const k of Object.keys(cond)) {
            if (!_.isNil(cond[k])) {
                placeholders.push(`${k} = :${k}`);
            }
        }
        return placeholders;
    }

    static updateConnection(id: number, cond: Partial<CassandraInfo>) {
        const placeholders = this.genConditionPlaceholders(cond);
        const stmt = db.prepare(`update t_connection set ${placeholders.join(', ')} where id = ${id}`);
        return stmt.run(cond).changes;
    }

    static deleteConnection(id: number) {
        const stmt = db.prepare(`delete from t_connection where id = ${id}`);
        return stmt.run().changes;
    }

    static findOneConnection(cond: Partial<CassandraInfo>): CassandraInfo {
        const placeholders = this.genConditionPlaceholders(cond);
        const stmt = db.prepare(`select * from t_connection where ${placeholders.join(' and ')}`);
        return stmt.get(cond);
    }

    static findManyConnection(cond?: Partial<CassandraInfo>): CassandraInfo[] {
        if (_.isNil(cond) || Object.keys(cond).length < 1) {
            const stmt = db.prepare(`select * from t_connection`);
            return stmt.all(cond);
        }
        const placeholders = this.genConditionPlaceholders(cond);
        const stmt = db.prepare(`select * from t_connection where ${placeholders.join(' and ')}`);
        return stmt.all(cond);

    }

    static listenConnectionChannel(mainWin: BrowserWindow) {
        ipcMain.handle(ConstantUtil.StorageIpcChannel.ADD_CONNECTION, (e, connection: CassandraInfo) => {
            const newId = this.addConnection(connection);
            mainWin.webContents.send(ConstantUtil.StorageIpcChannel.ADD_CONNECTION, newId);
            return newId;
        });
        ipcMain.handle(ConstantUtil.StorageIpcChannel.DELETE_CONNECTION, (e, id: number) => {
            mainWin.webContents.send(ConstantUtil.StorageIpcChannel.DELETE_CONNECTION, id);
            return this.deleteConnection(id);
        });
        ipcMain.handle(ConstantUtil.StorageIpcChannel.FIND_MANY_CONNECTION, (e, cond: Partial<CassandraInfo>) => {
            return this.findManyConnection(cond);
        });
        ipcMain.handle(ConstantUtil.StorageIpcChannel.FIND_ONE_CONNECTOIN, (e, cond: Partial<CassandraInfo>) => {
            return this.findOneConnection(cond);
        });
        ipcMain.handle(ConstantUtil.StorageIpcChannel.UPDATE_CONNECTION, (e, id: number, cond: Partial<CassandraInfo>) => {
            return this.updateConnection(id, cond);
        });
    }
}