
export default class ConstantUtil {
    static PathName = {
        MAIN: 'main',
        PANEL: 'panel',
        SETTING: 'setting',
        ADD_CONNECTION: 'add_connection'
    }

    static BVIpcChannel = {
        ADD_OR_FOUCUS: 'bv:add-or-focus',
        REMOVE: 'bv:remove',
        FOCUS: 'bv:focus',
    }

    static StorageIpcChannel = {
        ADD_CONNECTION: 'ls:connection:add',
        UPDATE_CONNECTION: 'ls:connection:update',
        DELETE_CONNECTION: 'ls:connection:delete',
        FIND_ONE_CONNECTOIN: 'ls:connection:findOne',
        FIND_MANY_CONNECTION: 'ls:connection:findMany',
    }

    static ActionChennel = {
        CLOSE_ADD_CONNECTION_WIN: 'ac:close_win',
        CHANGE_THEME: 'ac:change-theme',
        GET_CURRENT_THEME: 'ac:current-theme'
    }

    static BradgeChannel = {
        REFRESH_CONNECTIONS: 'bc:refresh-connection'
    }
}
