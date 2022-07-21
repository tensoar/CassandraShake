/**
 *  日期相关转换操作的封装
 *  @author wt
 */
 export default class DateUtil {
    /**
     *  将ISO格式日期字符串转为Date对象
     *
     * @param {string} iso ISO格式的日期字符串
     * @returns {Date}
     */
    static ISO2Date(iso: string): Date {
        return new Date(iso);
    }

    /**
     * 将Date对象格式化为只包含时分秒的字符串
     *
     * @param {Date} date 日期对象
     * @returns {string} 时:分:秒
     */
    static date2TimeStr(date: Date): string {
        return this.date2Format(date, "HH:mm:ss");
    }

    /**
     * 将ts类型时间字符(yyyy-LL-dd HH:mm:ss)串转为Date对象
     * @param ts 时间字符串
     * @returns {Date} Date对象
     */
    static ts2Date(ts: string): Date {
        return new Date(ts);
    }

    /**
     *  根据指定的日期格式形式将日期对象格式化为字符串
     *  年: y 月: L 日: d 时: H 分: m 秒: s
     *
     * @param {Date} date 日期对象
     * @param {string} format 格式表达式
     * @returns {string} 格式化后的字符串
     */
    static date2Format(date: Date, format: string): string {
        let ret;
        const opt = {
            "y+": date.getFullYear().toString(),
            "L+": (date.getMonth() + 1).toString(),
            "d+": date.getDate().toString(),
            "H+": date.getHours().toString(),
            "m+": date.getMinutes().toString(),
            "s+": date.getSeconds().toString()
        };
        // eslint-disable-next-line guard-for-in
        for (const k in opt) {
            // eslint-disable-next-line prefer-template
            ret = new RegExp("(" + k + ")").exec(format);
            if (ret) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, eqeqeq, no-param-reassign
                format = format.replace(ret[1], (ret[1].length == 1) ? (opt as any)[k] : ((opt as any)[k].padStart(ret[1].length, "0")));
            };
        };
        return format;
    }

    /**
     * 将Date对象格式化为ts格式(yyyy-LL-dd HH:mm:ss)的字符串
     *
     * @param date Date对象
     * @returns {string} ts字符串
     */
    static date2Ts(date: Date): string {
        return this.date2Format(date, 'yyyy-LL-dd HH:mm:ss');
    }

    /**
     * 将毫秒时间戳转为Date对象
     *
     * @param {number} mills 毫秒时间戳
     * @returns {Date} 日期
     */
    static mills2Date(mills: number): Date {
        return new Date(mills);
    }

    /**
     * 将日期对象转为毫秒时间戳
     *
     * @param {Date} date Date对象
     * @returns {number} 毫秒时间戳
     */
    static date2Mills(date: Date): number {
        return date.getTime();
    }

    /**
     * 获取当前日期
     *
     * @returns {Date} 当前日期
     */
    static now(): Date {
        return new Date();
    }

    /**
     * 获取当前毫秒时间戳
     *
     * @returns {number} 当前毫秒时间戳
     */
    static currentMills(): number {
        return new Date().getTime();
    }
}
