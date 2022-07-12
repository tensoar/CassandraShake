import { Navigate, useSearchParams } from 'react-router-dom';
import { ActionIcon, AppShell, BackgroundImage, Box, Center, Container, Header, Image, ThemeIcon } from '@mantine/core';
import Sidebar from './Sidebar';
import CassandraLogo from '../assets/CassandraLogo.svg';

export default function Main() {

    return (
        <Box style={{width: '100%', height: '300px'}}>
            <AppShell
                sx= {theme => ({
                    background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                })}
                padding="md"
                navbar={
                    <Sidebar
                        nav={{
                            width: { base: 280 },
                            sx: theme => ({
                                background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                            })
                        }}
                    />
                }
            >
                <Center
                    style={{width: '100%', height: '90%'}}
                    sx= {theme => ({
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                    })}
                >
                    <Image src={CassandraLogo} alt="cassandra-shake" />
                </Center>
            </AppShell>
        </Box>
    );
}
