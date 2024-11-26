import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import '../home.css'
import { Badge, Button, Container, Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExcel } from "@fortawesome/free-regular-svg-icons"
import { saveAs } from "file-saver"
import { useRef } from "react"

export default function ICT({ userInfo }) {
    const [formData, setFormData] = useState({
        period1: "",
        period2: "",
        ict_no: "",
        model: "",
        step: "",
        file_name: "",
        item: "",
        operator_name: "",
        programming_file: "",
        self_check: "",
    })
    const [rowData, setRowData] = useState({ data: [] })
    const [selectedRowData, setSelectedRowData] = useState({})
    const [selectedRowDataIndex, setSelectedRowDataIndex] = useState(-1)

    const [isSearching, setIsSearching] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isChecking, setIsChecking] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [pageAt, setPageAt] = useState(0)
    const [isMaxPage, setIsMaxPage] = useState(false)
    const refInputDate1 = useRef(null)
    const refInputDate2 = useRef(null)
    const refInputRemark = useRef(null)

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    function handleChangeRemark(e) {
        setSelectedRowData({ ...selectedRowData, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        let aTable = document.getElementById('coba')
        let aStack1 = document.getElementById('stack1')
        let aStack2 = document.getElementById('stack2')
        let aStack3 = document.getElementById('stack3')
        let aStack4 = document.getElementById('stack4')
        let aStack5 = document.getElementById('stack5')
        let aStack6 = document.getElementById('stack6')
        let aStack7 = document.getElementById('stack7')
        let aStack8 = document.getElementById('stack8')
        aTable.style.cssText = `height: ${window.innerHeight
            - aStack1.offsetHeight
            - aStack2.offsetHeight
            - aStack3.offsetHeight
            - aStack4.offsetHeight
            - aStack5.offsetHeight
            - aStack6.offsetHeight
            - aStack7.offsetHeight
            - aStack8.offsetHeight
            - 130
            }px`
        const currentDate = new Date().toISOString().substring(0, 10)

        refInputDate1.current.value = currentDate
        refInputDate2.current.value = currentDate

        setFormData({
            period1: currentDate,
            period2: currentDate,
            ict_no: "",
            model: "",
            file_name: "",
            item: "",
            operator_name: "",
            programming_file: "",
            self_check: "",
        })


    }, [])

    function handleClickSearch() {
        goToPage(1)
    }

    function goToPage(thePage) {
        const params = new URLSearchParams(formData).toString()
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }
        setIsSearching(true)
        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/ict/trace-paginate?' + params + '&page=' + thePage, config)
            .then((response) => {
                const datanya = response.data.data.data
                setRowData({
                    data: datanya
                })
                setIsSearching(false)
                setPageAt(thePage)
                if (!response.data.data.next_page_url) {
                    setIsMaxPage(true)
                } else {
                    setIsMaxPage(false)
                }
            }).catch(error => {
                setIsSearching(false)
                setPageAt(0)
            })
    }

    function handleGoingToPreviousPage() {
        goToPage(pageAt - 1)
    }

    function handleGoingToNextPage() {
        goToPage(pageAt + 1)
    }

    function handleClickExport() {
        const params = new URLSearchParams(formData).toString()
        setIsExporting(true)
        if (confirm('Are you sure want to export the data ?')) {
            axios({
                url: import.meta.env.VITE_APP_ENDPOINT + '/ict/to-spreadsheet?' + params,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                setIsExporting(false)
                saveAs(response.data, 'ICT Logs ' + Date.now() + ' .xlsx')
            }).catch(error => {
                setIsExporting(false)
            })
        }
    }

    function handleClickCheck(parIndex, parData) {
        setSelectedRowData(parData)
        setSelectedRowDataIndex(parIndex)
        setShow(true)
    }

    function handleClose() {
        setShow(false)
    }
    function handleCloseModalRemark() {
        setShow2(false)
    }
    function handleShowModalRemark(parIndex, parData) {
        setSelectedRowData(parData)
        setSelectedRowDataIndex(parIndex)
        setShow2(true)
    }

    function handleSetChecked() {
        const config = {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }
        setIsChecking(true)
        axios.put(import.meta.env.VITE_APP_ENDPOINT + '/ict/check', selectedRowData, config)
            .then((response) => {
                setIsChecking(false)
                const theChecekedDate = new Date().toISOString().replace('T', ' ').replace('Z', '')
                const nextRow = rowData.data.map((item, index) => {
                    if (index == selectedRowDataIndex) {
                        switch (userInfo.role_id) {
                            case '1':
                                return {
                                    ...item, ICT_Lupdt1: theChecekedDate
                                }
                            case '2':
                                return {
                                    ...item, ICT_Lupdt2: theChecekedDate
                                }
                            case '3':
                                return {
                                    ...item, ICT_Lupdt3: theChecekedDate
                                }
                            case '4':
                                return {
                                    ...item, ICT_Lupdt4: theChecekedDate
                                }
                            case '5':
                                return {
                                    ...item, ICT_Lupdt5: theChecekedDate
                                }
                            case '6':
                                return {
                                    ...item, ICT_Lupdt6: theChecekedDate
                                }
                            default:
                                return {
                                    ...item, ICT_LupdtApp: theChecekedDate
                                }
                        }
                    } else {
                        return item
                    }
                })
                setRowData({
                    data: nextRow
                })
                setShow(false)
            }).catch(error => {
                setIsChecking(false)
                alert(error)
                alert(error.response.data.message)
            })
    }

    function hanldeSetRemark() {
        if (confirm('Are you sure ?')) {
            const config = {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
            axios.put(import.meta.env.VITE_APP_ENDPOINT + '/ict/remark', selectedRowData, config)
                .then((response) => {
                    const nextRow = rowData.data.map((item, index) => {
                        if (index == selectedRowDataIndex) {
                            if (selectedRowData.ICT_Remark) {
                                let newRemark = JSON.parse(selectedRowData.ICT_Remark)
                                newRemark.push({ userid: userInfo.nick_name, remark: selectedRowData.ICT_RemarkNew })
                                return {
                                    ...item, ICT_Remark: JSON.stringify(newRemark)
                                }
                            } else {

                                let newRemark = [{ userid: userInfo.nick_name, remark: selectedRowData.ICT_RemarkNew }]
                                return {
                                    ...item, ICT_Remark: JSON.stringify(newRemark)
                                }
                            }
                        } else {
                            return item
                        }
                    })
                    setRowData({
                        data: nextRow
                    })

                    setShow2(false)
                }).catch(error => {
                    alert(error)
                })
        }
    }

    function handleApprove() {
        if (formData.period1 != formData.period2) {
            alert('Only one day is required to be processed')
            return
        }
        if (confirm('Are you sure ?')) {
            const config = {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }
            setIsApproving(true)
            axios.put(import.meta.env.VITE_APP_ENDPOINT + '/ict/check-some', formData, config)
                .then((response) => {
                    setIsApproving(false)
                    const theChecekedDate = new Date().toISOString().replace('T', ' ').replace('Z', '')
                    const nextRow = rowData.data.map((item, index) => {
                        if (item.ICT_Lupdt6) {
                            if (item.ICT_Lupdt6.substring(0, 4) != '1900' && !item.ICT_LupdtApp) {
                                return {
                                    ...item, ICT_LupdtApp: theChecekedDate
                                }
                            }
                            return item
                        } else {
                            return item
                        }

                    })
                    setRowData({
                        data: nextRow
                    })
                }).catch(error => {
                    setIsApproving(false)
                })
        }
    }

    return (
        <Container fluid>
            <form>
                <div className="row mt-3" id="stack1">
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text" > Period from</span>
                            <input type="date" className="form-control" name="period1" onChange={handleChange} ref={refInputDate1} />
                            <span className="input-group-text" >To</span>
                            <input type="date" className="form-control" name="period2" onChange={handleChange} ref={refInputDate2} />
                        </div>
                    </div>
                </div>
                <div className="row" id="stack2">
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text" >ICT No</span>
                            <input type="text" className="form-control" name="ict_no" maxLength={15} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="row" id="stack3">
                    <div className="col-md-3">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text" >Model</span>
                            <input type="text" className="form-control" name="model" maxLength={50} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text" >Step</span>
                            <input type="text" className="form-control" name="step" maxLength={15} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="row" id="stack4">
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">File Name</span>
                            <input type="text" className="form-control" name="file_name" maxLength={50} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="row" id="stack5">
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">Item</span>
                            <input type="text" className="form-control" name="item" maxLength={50} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="row" id="stack6">
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">Operator Name</span>
                            <input type="text" className="form-control" name="operator_name" maxLength={50} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className="row" id="stack7">
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">Programming File</span>
                            <input type="text" className="form-control" name="programming_file" maxLength={50} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text">Filter Self-Checking</span>
                            <select className="form-select" name="self_check" onChange={handleChange}>
                                <option value={'-'}>All</option>
                                <option value={'1'}>Not Checked</option>
                                <option value={'2'}>Checked</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row" id="stack8">
                    <div className="col-md-4 mb-3">
                        <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-primary" disabled={isSearching} onClick={handleClickSearch}>Search</button>
                            <button type="reset" className="btn btn-outline-primary">Reset search criteria</button>
                            <button type="button" className="btn btn-success" title="Export to spreadsheet file" onClick={handleClickExport} disabled={isExporting}><FontAwesomeIcon icon={faFileExcel} /></button>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3 text-center">
                        <PSIButtonApproval propDataRows={rowData} proCurrentRole={userInfo.role_id} onApprove={handleApprove} propApproving={isApproving} />
                    </div>
                    <div className="col-md-4 mb-3 text-end">
                        <Badge bg="info">{rowData.data.length > 0 ? rowData.data.length + ' rows found' : ''}</Badge>
                    </div>
                </div>
            </form>
            <div className="row">
                <div className="col-md-12 mb-1">
                    <div className="table-responsive" id="coba">
                        <table className="table align-middle table-sm table-bordered table-hover">
                            <thead className="text-center table-dark">
                                <tr className="first">
                                    <th rowSpan={2} className="align-middle">Date</th>
                                    <th rowSpan={2} className="align-middle">Time</th>
                                    <th rowSpan={2} className="align-middle">ICT No</th>
                                    <th rowSpan={2} className="align-middle">Model</th>
                                    <th rowSpan={2} className="align-middle">File Name</th>
                                    <th rowSpan={2} className="align-middle">Step</th>
                                    <th rowSpan={2} className="align-middle">Device</th>
                                    <th rowSpan={2} className="align-middle">Item</th>
                                    <th rowSpan={2} className="align-middle">Before Value</th>
                                    <th rowSpan={2} className="align-middle">After Value</th>
                                    <th rowSpan={2} className="align-middle">Operator Name</th>
                                    <th rowSpan={2} className="align-middle">User Level</th>
                                    <th rowSpan={2} className="align-middle">Program File</th>
                                    <th colSpan={6} className="text-center">Checked By</th>
                                    <th className="align-middle">Approval</th>
                                    <th rowSpan={2} className="align-middle">Remark</th>
                                </tr>
                                <tr className="second">
                                    <th style={{ whiteSpace: 'nowrap' }}>Gilang</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Rico</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Adi S</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Sanawi</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Kiswanto</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Muttaqin</th>
                                    <th style={{ whiteSpace: 'nowrap' }}>Mr. Syofyan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isSearching ? <tr><td colSpan={20}>Please wait</td></tr> : rowData.data.map((item, index) => {
                                        return <tr key={index} className="font-monospace">
                                            <td>{item.ICT_Date}</td>
                                            <td>{item.ICT_Time}</td>
                                            <td>{item.ICT_No}</td>
                                            <td>{item.ICT_Model}</td>
                                            <td>{item.ICT_NFile}</td>
                                            <td>{item.ICT_Step}</td>
                                            <td>{item.ICT_Device}</td>
                                            <td>{item.ICT_Item}</td>
                                            <td>{item.ICT_BValue}</td>
                                            <td>{item.ICT_AValue}</td>
                                            <td>{item.ICT_Lupby}</td>
                                            <td>{item.ICT_Level}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{item.ICT_PFile}</td>
                                            <PSITd proInfo={item.ICT_Lupdt1} proRole={1} proCurrentRole={userInfo.role_id} propData={item} propDataIndex={index} onCheck={handleClickCheck} />
                                            <PSITd proInfo={item.ICT_Lupdt3} proRole={3} proCurrentRole={userInfo.role_id} propData={item} propDataIndex={index} onCheck={handleClickCheck} />
                                            <PSITd proInfo={item.ICT_Lupdt2} proRole={2} proCurrentRole={userInfo.role_id} propData={item} propDataIndex={index} onCheck={handleClickCheck} />
                                            <PSITd proInfo={item.ICT_Lupdt4} proRole={4} proCurrentRole={userInfo.role_id} propData={item} propDataIndex={index} onCheck={handleClickCheck} />
                                            <PSITd proInfo={item.ICT_Lupdt5} proRole={5} proCurrentRole={userInfo.role_id} propData={item} propDataIndex={index} onCheck={handleClickCheck} />
                                            <PSITd proInfo={item.ICT_Lupdt6} proRole={6} proCurrentRole={userInfo.role_id} propData={item} propDataIndex={index} onCheck={handleClickCheck} />
                                            <PSITd proInfo={item.ICT_LupdtApp} proRole={7} proCurrentRole={userInfo.role_id} propData={item} propDataIndex={index} onCheck={handleClickCheck} />
                                            <PISTdRemark onShowModalRemark={handleShowModalRemark} propData={item} propDataIndex={index} />
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    {
                        pageAt > 0 && (<ul className="pagination justify-content-center">
                            <li className={pageAt == 1 ? 'page-item disabled' : 'page-item'}><a className="page-link" href="#" onClick={handleGoingToPreviousPage}>Previous</a></li>
                            <li className={isMaxPage ? 'page-item disabled' : 'page-item'}><a className="page-link" href="#" onClick={handleGoingToNextPage}>Next</a></li>
                        </ul>)
                    }

                </div>
            </div>

            <Modal show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col">
                            <div className="input-group input-group-sm mb-1">
                                <span className="input-group-text" >Device</span>
                                <input type="text" className="form-control" value={selectedRowData.ICT_Device} disabled />
                            </div>
                            <div className="input-group input-group-sm mb-1">
                                <span className="input-group-text" >Item</span>
                                <input type="text" className="form-control" value={selectedRowData.ICT_Item} disabled />
                            </div>
                            <div className="input-group input-group-sm mb-1">
                                <span className="input-group-text" >Before Value</span>
                                <input type="text" className="form-control" value={selectedRowData.ICT_BValue} disabled />
                            </div>
                            <div className="input-group input-group-sm mb-1">
                                <span className="input-group-text" >After Value</span>
                                <input type="text" className="form-control" value={selectedRowData.ICT_AValue} disabled />
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSetChecked} disabled={isChecking}>
                        Conform
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={show2} onHide={handleCloseModalRemark} size="lg" onEntered={() => { refInputRemark.current.focus() }}>
                <Modal.Header closeButton>
                    <Modal.Title>Write remark</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col">
                            <label className="form-label">Remark</label>
                            <textarea ref={refInputRemark} className="form-control" rows="3" onChange={handleChangeRemark} name="ICT_RemarkNew"></textarea>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={hanldeSetRemark}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

function PSITd({ proInfo, proRole, proCurrentRole, propData, propDataIndex, onCheck }) {
    if (proInfo?.substring(0, 4) == '1900' || !proInfo) {
        if (proRole == 7) {
            if (propData.ICT_Lupdt6?.substring(0, 4) == '1900' || !propData.ICT_Lupdt6) {
                return <td className="text-center"></td>
            }

            return <td className="text-center"> {proRole == proCurrentRole ? <button type="button" className="btn btn-sm btn-primary" onClick={(e) => onCheck(propDataIndex, propData)}>Check</button> : ''}</td>
        } else {
            return <td className="text-center"> {proRole == proCurrentRole ? <button type="button" className="btn btn-sm btn-primary" onClick={(e) => onCheck(propDataIndex, propData)}>Check</button> : ''}</td>
        }
    }
    return (
        <td className="text-center">{proInfo}</td>
    )
}

function PISTdRemark({ onShowModalRemark, propData, propDataIndex, }) {
    let item = JSON.parse(propData.ICT_Remark)
    if (item) {
        return (
            <td style={{ cursor: 'pointer' }} onClick={(e) => onShowModalRemark(propDataIndex, propData)}>
                {item.map((item, index) => {
                    return (<div key={index}><Badge bg="info" >{item.remark}</Badge> </div>)
                })}
            </td>
        )
    }
    return (
        <td style={{ cursor: 'pointer' }} onClick={(e) => onShowModalRemark(propDataIndex, propData)}>{propData.ICT_Remark}</td>
    )
}

function PSIButtonApproval({ proCurrentRole, propDataRows, onApprove, propApproving }) {
    const totalRowsTobeApproved = propDataRows.data.filter((item) => {
        if (item.ICT_Lupdt6) {
            if (item.ICT_Lupdt6.substring(0, 4) != '1900' && !item.ICT_LupdtApp) {
                return item
            }
        }
    }).length
    if (totalRowsTobeApproved > 0 && proCurrentRole == 7) {
        return (
            <button disabled={propApproving} className="btn btn-sm btn-primary" onClick={onApprove} type="button"> Approve</button>
        )
    }
    return ('')
}