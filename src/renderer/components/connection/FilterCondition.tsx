import { Textarea, useMantineTheme, Box, Center, Text, Group, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import CassandraUtil from "../../util/CassandraUtil";

import { useTypedSelector } from "../../redux/HooksWrapper";

interface Props {
    keyspace: string;
    table: string;
}

export default function FilterCondition({keyspace, table}: Props) {
    const theme = useMantineTheme();
    const isConnected = useTypedSelector(state => state.connectionState.isConnected);
    const client = useTypedSelector(state => state.connectionState.client);

    if (!keyspace || !table) {
        return <Box>
            <p>No keyspace or table was selected ...</p>
        </Box>
    }

    return <Box>
        <p>{keyspace}.{table}</p>
    </Box>
}
