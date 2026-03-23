// <ai_context>
// A reusable Server-Side DataTable Component handling pagination, sorting, and debounced filtering.
// Completely avoids client-side sorting/filtering to delegate the load securely to Laravel endpoints.
// </ai_context>

import React, { useState, useEffect } from 'react';
import { Table, Pagination, Group, LoadingOverlay, Box, Text, UnstyledButton, Center } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconChevronUp, IconChevronDown, IconSelector } from '@tabler/icons-react';
import { TextInput } from '../Input/TextInput';

/**
 * Interface defining column structure for the DataTable component.
 */
export interface Column<T = any> {
    /** Unique key identifying the specific object attribute */
    key: string;
    /** Human-readable label displayed in the Table Header */
    label: string;
    /** If true, the column becomes clickable to delegate 'onSort' events */
    sortable?: boolean;
    /** Optional custom React render pattern for complex cells */
    render?: (record: T) => React.ReactNode;
}

/**
 * Prop interface for the server-bound DataTable
 */
export interface DataTableProps<T = any> {
    /** Array defining keys, labels, and sortable status */
    columns: Column<T>[];
    /** Segment of records returned from the backend */
    records: T[];
    /** Absolute grand total count used for pagination */
    totalRecords: number;
    /** Currently active page index */
    page: number;
    /** Callback fired when navigating to a new page */
    onPageChange: (page: number) => void;
    /** Callback fired to execute an external backend sort */
    onSort: (columnKey: string, direction: 'asc'|'desc') => void;
    /** Callback triggered 300ms after the filter text changes */
    onFilterChange: (filters: Record<string, any>) => void;
    /** Native flag triggering Mantine's LoadingOverlay locking the table bounds */
    isLoading: boolean;
    /** How many items per request (defaults to 15) */
    itemsPerPage?: number;
}

/**
 * Reusable JOPPA Server-Side DataTable Component
 * 
 * Safely manages tabular state relying solely on the remote backend Laravel queries.
 * Connects directly to our standardized 'TextInput' for global debounced searching.
 */
export const DataTable = <T extends Record<string, any>>({
    columns,
    records,
    totalRecords,
    page,
    onPageChange,
    onSort,
    onFilterChange,
    isLoading,
    itemsPerPage = 15,
}: DataTableProps<T>) => {
    const [sortStatus, setSortStatus] = useState<{ columnKey: string; direction: 'asc' | 'desc' } | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    
    // Automatically debounce rapid search entries to avoid overloading the backend
    const [debouncedFilter] = useDebouncedValue(globalFilter, 300);

    // Trigger parent filter callback when debounced filter commits
    useEffect(() => {
        onFilterChange({ search: debouncedFilter });
    }, [debouncedFilter, onFilterChange]);

    /**
     * Toggles asc/desc internal state and triggers the secure onSort bound.
     */
    const handleSort = (columnKey: string) => {
        let newDirection: 'asc' | 'desc' = 'asc';
        
        if (sortStatus?.columnKey === columnKey) {
            newDirection = sortStatus.direction === 'asc' ? 'desc' : 'asc';
        }
        
        setSortStatus({ columnKey, direction: newDirection });
        onSort(columnKey, newDirection);
    };

    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    return (
        <Box pos="relative">
            <Group justify="space-between" mb="md">
                <TextInput
                    placeholder="Search records..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    style={{ minWidth: 300 }}
                />
            </Group>

            <Box pos="relative" style={{ minHeight: 250 }}>
                <LoadingOverlay visible={isLoading} zIndex={100} overlayProps={{ radius: 'sm', blur: 2 }} />
                
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            {columns.map((col) => (
                                <Table.Th key={col.key}>
                                    {col.sortable ? (
                                        <UnstyledButton onClick={() => handleSort(col.key)} style={{ width: '100%' }}>
                                            <Group justify="space-between" wrap="nowrap">
                                                <Text fw={600} size="sm">{col.label}</Text>
                                                <Center>
                                                    {sortStatus?.columnKey === col.key ? (
                                                        sortStatus.direction === 'asc' ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                                                    ) : (
                                                        <IconSelector size={16} color="var(--mantine-color-dimmed)" />
                                                    )}
                                                </Center>
                                            </Group>
                                        </UnstyledButton>
                                    ) : (
                                        <Text fw={600} size="sm">{col.label}</Text>
                                    )}
                                </Table.Th>
                            ))}
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {records.length > 0 ? (
                            records.map((record, index) => (
                                <Table.Tr key={record.id || index}>
                                    {columns.map((col) => (
                                        <Table.Td key={col.key}>
                                            {col.render ? col.render(record) : record[col.key]}
                                        </Table.Td>
                                    ))}
                                </Table.Tr>
                            ))
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={columns.length}>
                                    <Text ta="center" py="xl" c="dimmed">No records currently available.</Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Box>

            {totalPages > 1 && (
                <Group justify="flex-end" mt="md">
                    <Pagination
                        total={totalPages}
                        value={page}
                        onChange={onPageChange}
                        color="darkGreen"
                        radius="md"
                    />
                </Group>
            )}
        </Box>
    );
};
