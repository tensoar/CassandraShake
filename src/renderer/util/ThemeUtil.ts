import { MantineTheme } from "@mantine/core";

export default class ThemeUtil {
    static defaultFontColor(theme: MantineTheme) {
        return theme.colorScheme === 'light' ? theme.colors.gray[8] : theme.colors.dark[2];
    }

    static defaultBackgroudColor(theme: MantineTheme) {
        return theme.colorScheme === 'light' ? theme.colors.gray[1] : theme.colors.dark[5];
    }

    static defaultBorderColor(theme: MantineTheme) {
        return theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[3];
    }
}