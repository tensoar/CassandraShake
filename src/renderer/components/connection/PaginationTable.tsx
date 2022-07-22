import { Table, Box, Space, Grid, Button, Group, NumberInput, Text, useMantineTheme, Alert, Stack } from "@mantine/core";
import { types as CassandraTypes } from "cassandra-driver"
import { useEffect, useState } from "react"
import { AlertCircle } from "tabler-icons-react";
import ThemeUtil from "../../util/ThemeUtil";

type Props = {
    rows:Record<string, any>[],
}

export default function PaginationTable(props: Props) {
    const theme = useMantineTheme();
    const [currentRows, setCurrentRows] = useState<Record<string, any>[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [tableHeaders, setTableHeaders] = useState<string[]>([]);
    const [jumpPage, setJumpPage] = useState(0);
    const rowsPerPage = 20;

    useEffect(() => {
        setCurrentRows(__ => props.rows.slice(0, rowsPerPage));
        setCurrentPage(1);
        setTotalPages(Math.ceil(props.rows.length / rowsPerPage));
        setTableHeaders(props.rows.length? Object.keys(props.rows[0]): []);
    }, [props.rows]);

    useEffect(() => {
        const starter = (currentPage - 1) * rowsPerPage;
        setCurrentRows(__ => props.rows.slice(starter, starter + rowsPerPage));
        setJumpPage(currentPage);
    }, [currentPage, props.rows]);

    const jumpTo = () => {
        let to = jumpPage;
        if (to < 1) {
            to = 1;
        } else if (to > totalPages) {
            to = totalPages;
        }
        setCurrentPage(to);
    }

    return props.rows.length > 0 ? <Box
        style={{
            width: '100%',
            height: '100%',
            // overflow: 'auto',
        }}
    >
        <Box
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: ThemeUtil.defaultBackgroudColor(theme),
                opacity: 1,
            }}
            sx={th => ({
                overflow: 'auto',
                // scrollbarWidth: "thin",
                '::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                },
                '::-webkit-scrollbar-corner': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4]: theme.colors.blue[0]
                },
                "::-webkit-scrollbar-thumb": {
                    // 滚动条
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7]: theme.colors.gray[4],
                    borderRadius: 20
                },
                '::-webkit-scrollbar-track': {
                    // 滚动区域
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[4]: theme.colors.blue[0],
                    borderRadius: 20
                 }
            })}
        >
            <Table
                highlightOnHover
                striped
            >
                <thead
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        opacity: 1,
                        backgroundColor: ThemeUtil.defaultBackgroudColor(theme)
                    }}
                >
                    <tr>
                        {tableHeaders.map(h => (
                            <th>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{position: 'sticky', left: 0 , top: 20}}>
                    {currentRows.map((row, i) => {
                        return <tr key={i}>
                            {Object.keys(row).map(k => (
                                <td>{row[k]}</td>
                            ))}
                        </tr>
                    })}
                </tbody>
            </Table>
        </Box>
        <Group spacing="xs" mt={10}>
            <Button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage <= 1}
                variant="outline"
            >
                {"<"}
            </Button>
            <Button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= totalPages}
                variant="outline"
            >
                {">"}
            </Button>
            <NumberInput
                style={{
                    width: 60
                }}
                hideControls
                value={jumpPage}
                onChange={v => setJumpPage(v as number)}
            />
            <Text size="md" weight="bold" color={ThemeUtil.defaultFontColor(theme)}>/ {totalPages}</Text>
            <Button variant="light" onClick={jumpTo}>Jump</Button>
        </Group>
    </Box>:
    <Box>
        <Alert icon={<AlertCircle size={16} />} title="Empty" color="gray">
            Result is empty ...
        </Alert>
    </Box>
}