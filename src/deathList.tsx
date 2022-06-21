import React from "react";
import styles from "./unvalided-death.scss";
import { SearchInput, Toolbar_Button } from "./toolbar_search_container";
import { useState, useEffect } from "react";
import getPatients from "./getPatient";
import { useTranslation } from "react-i18next";
import {
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHeader,
    TableRow,
    TableHead,
    Pagination
} from 'carbon-components-react';
import { navigate, NavigateOptions } from "@openmrs/esm-framework";

export interface DeathListProps {
    headers: { key: string; header: string; }[]
}
const DeathList: React.FC<DeathListProps> = ({ headers }) => {

    const [rowsTable, setRows] = useState([]);
    const [TotalpageSize, setTotalPageSize] = useState(1);
    const [[PageSize, Page], setPaginationPageSize] = useState([5, 1]);
    const [PaginationPageSize, PaginationPage] = [5, 1];
    const paginationPageSizes = [1, 5, 10, 20, 30, 40];
    const [[prev, next], setLink] = useState(['', '']);
    const { t } = useTranslation();
    const toDeclared: NavigateOptions = { to: window.spaBase + "/death/declare" };

    function onTableRowHandleClick(e, rowSelected) {
        rowsTable.forEach(row => {
            const toValided: NavigateOptions = { to: window.spaBase + "/death/patient/validation/" + row.id };
            if (row.No_dossier == rowSelected.cells[0].value) {
                navigate(toValided)
            }
        })
    }
    useEffect(function () {
        changeRows(PageSize, 1);
    }, []);

    function changeRows(pagesize, page) {
        let url;
        if (((prev || next) == '') || (pagesize != PageSize)) {
            url = "/openmrs/ws/fhir2/R4/Patient?_count=" + pagesize + "&_getpagesoffset=" + page;
        }
        else {
            if (page > Page) {
                url = next
            } else {
                url = prev
            }
        }
        setPaginationPageSize([pagesize, page]);
        fetch(url)
            .then(response => {
                return response.json()
            })
            .then(json => {
                setLink([json?.link[2]?.url, json?.link[1]?.url]);
                setTotalPageSize(json?.total);
                setRows(getPatients(json));
            })
            .catch(error => {
            });
    }

    function onPaginationChange(e) {
        changeRows(e.pageSize, e.page);
    }
    return (
        <DataTable rows={rowsTable} headers={headers} useZebraStyles={true}  >
            {({
                rows,
                headers,
                getHeaderProps,
                getRowProps,
                getTableProps,
                onInputChange,
                getTableContainerProps,
            }) =>
            (
                <>
                    <TableContainer {...getTableContainerProps()} >
                        <div className={styles.TableContainer}>
                            <div className={"bx--toolbar-content"}>
                                <SearchInput
                                    className={styles['search-1']}
                                    onChange={(e) => ((e.currentTarget.value.trim().length) > 0) && onInputChange(e)} />
                                <Toolbar_Button onClickChange={(e)=>{navigate(toDeclared)} } label={t('DeclareDeath', 'Déclarer un mort')} />

                            </div>
                        </div>
                        <TableContainer className={styles.table}>
                            <Table
                                {...getTableProps()} size="lg" >
                                <TableHead className={styles.TableRowHeader} >

                                    {headers.map((header) => (
                                        <TableHeader key={header.key} {...getHeaderProps({ header, isSortable: true })}>
                                            {header.header}
                                        </TableHeader>
                                    ))}
                                </TableHead>
                                <TableBody className={styles.TableBody}>
                                    {rows.map((row) => (
                                        <TableRow className={styles.TableRow} key={row.id}  {...getRowProps({ row })} onClick={e => { onTableRowHandleClick(e, row) }} >
                                            {row.cells.map(cell => (
                                                <TableCell key={cell.id} children={cell.value} />
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableContainer>
                    <div>
                        <div>
                            <Pagination
                                backwardText="Previous page"
                                forwardText="Next page"
                                itemsPerPageText="Show"
                                onChange={onPaginationChange}
                                page={PaginationPage}
                                pageSize={PaginationPageSize}
                                pageSizes={paginationPageSizes}
                                size="md"
                                totalItems={TotalpageSize}
                            />
                        </div>
                    </div>
                </>
            )}
        </DataTable>
    );
}

export default DeathList;
