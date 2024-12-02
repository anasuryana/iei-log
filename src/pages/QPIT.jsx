import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import '../home.css'
import { Badge, Container } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExcel } from "@fortawesome/free-regular-svg-icons"
import { saveAs } from "file-saver"
import { useRef } from "react"

export default function QPIT({ userInfo }) {
    const [formData, setFormData] = useState({
        period1: "",
        period2: "",
        production_control: "",
        assy_no: "",
        type: "",
        model: "",
        test_result: "",
        line: "",
    })
    const [rowData, setRowData] = useState({ data: [] })

    const [isSearching, setIsSearching] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [pageAt, setPageAt] = useState(0)
    const [isMaxPage, setIsMaxPage] = useState(false)
    const refInputDate1 = useRef(null)
    const refInputDate2 = useRef(null)


    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
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
            production_control: "",
            assy_no: "",
            type: "",
            model: "",
            test_result: "",
            line: "",
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
        console.log(config)
        setIsSearching(true)
        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/qpit/trace-paginate?' + params + '&page=' + thePage, config)
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
                url: import.meta.env.VITE_APP_ENDPOINT + '/qpit/trace-to-spreadsheet?' + params,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                setIsExporting(false)
                saveAs(response.data, 'QPIT Logs ' + Date.now() + ' .xlsx')
            }).catch(error => {
                setIsExporting(false)
            })
        }
    }

    return (
        <>
            {
                userInfo.name.includes('init') ? userInfo.name : <Container fluid>
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
                                    <span className="input-group-text" >Production Control</span>
                                    <input type="text" className="form-control" name="production_control" maxLength={15} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row" id="stack3">
                            <div className="col-md-3">
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text" >Assy No</span>
                                    <input type="text" className="form-control" name="assy_no" maxLength={50} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row" id="stack4">
                            <div className="col-md-6">
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text">Type</span>
                                    <input type="text" className="form-control" name="type" maxLength={50} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row" id="stack5">
                            <div className="col-md-6">
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text">Model</span>
                                    <input type="text" className="form-control" name="model" maxLength={50} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row" id="stack6">
                            <div className="col-md-6">
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text">Test Result</span>
                                    <select className="form-select" name="test_result" onChange={handleChange}>
                                        <option value={'-'}>Please select</option>
                                        <option value={'PASS'}>PASS</option>
                                        <option value={'FAIL'}>FAIL</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row" id="stack7">
                            <div className="col-md-6">
                                <div className="input-group input-group-sm mb-1">
                                    <span className="input-group-text">Line</span>
                                    <input type="text" className="form-control" name="line" maxLength={50} onChange={handleChange} />
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

                            </div>
                            <div className="col-md-4 mb-3 text-end">
                                {isSearching ? '' : <Badge bg="info">{rowData.data.length > 0 ? rowData.data.length + ' rows found (page ' + pageAt + ')' : ''}</Badge>}
                            </div>
                        </div>
                    </form>
                    <div className="row">
                        <div className="col-md-12 mb-1">
                            <div className="table-responsive" id="coba">
                                <table className="table align-middle table-sm table-bordered table-hover">
                                    <thead className="text-center table-dark">
                                        <tr className="first">
                                            <th colSpan={3} className="align-middle">Test</th>
                                            <th rowSpan={2} className="align-middle" style={{ whiteSpace: 'nowrap' }}>Production Control No</th>
                                            <th rowSpan={2} className="align-middle">Assy No</th>
                                            <th rowSpan={2} className="align-middle">Type</th>
                                            <th rowSpan={2} className="align-middle">Model</th>
                                            <th colSpan={5} className="align-middle">Error</th>
                                            <th rowSpan={2} className="align-middle">Line</th>
                                            <th rowSpan={2} className="align-middle">Shift</th>
                                            <th rowSpan={2} className="align-middle">PC No</th>
                                            <th rowSpan={2} className="align-middle">Jig No</th>
                                            <th rowSpan={2} className="align-middle" style={{ whiteSpace: 'nowrap' }}>Power Box No</th>
                                            <th rowSpan={2} className="align-middle" style={{ whiteSpace: 'nowrap' }}>QPITPC System Program Ver</th>
                                            <th rowSpan={2} className="align-middle" style={{ whiteSpace: 'nowrap' }}>Test Program Ver</th>
                                            <th rowSpan={2} className="align-middle" style={{ whiteSpace: 'nowrap' }}>Detail Setting</th>
                                            <th rowSpan={2} className="align-middle" style={{ whiteSpace: 'nowrap' }}>Function Test Sum</th>
                                            <th rowSpan={2} className="align-middle">Operator</th>
                                            <th rowSpan={2} className="align-middle" style={{ whiteSpace: 'nowrap' }}>Password Ver</th>
                                        </tr>
                                        <tr className="second">
                                            <th style={{ whiteSpace: 'nowrap' }}>Time</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Process</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Result</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Code</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Class</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Address</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Details</th>
                                            <th style={{ whiteSpace: 'nowrap' }}>Pin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            isSearching ? <tr><td colSpan={16}>Please wait</td></tr> : rowData.data.map((item, index) => {
                                                return <tr key={index} className="font-monospace">
                                                    <td>{item.Test_Time}</td>
                                                    <td>{item.Test_Process}</td>
                                                    <td>{item.Test_Result}</td>
                                                    <td>{item.Production_Control_No}</td>
                                                    <td>{item.AssyNo}</td>
                                                    <td>{item.BoardNo}</td>
                                                    <td>{item.PdtNo}</td>
                                                    <td>{item.Error_Code}</td>
                                                    <td>{item.Error_Class}</td>
                                                    <td>{item.Error_Address}</td>
                                                    <td>{item.Error_Details}</td>
                                                    <td>{item.Error_Pin_No}</td>
                                                    <td>{item.Line_Name}</td>                                                    
                                                    <td style={{ whiteSpace: 'nowrap' }}>{item.Shift_Name}</td>
                                                    <td>{item.PC_No}</td>
                                                    <td>{item.Jig_No}</td>
                                                    <td>{item.Power_Box_No}</td>
                                                    <td>{item.Target_Program_Ver}</td>
                                                    <td>{item.Test_Program_Ver}</td>
                                                    <td>{item.Detailed_Setting}</td>
                                                    <td>{item.Function_Test_Sum}</td>
                                                    <td>{item.Operator_Name}</td>
                                                    <td>{item.Password_Ver}</td>
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
                </Container>
            }
        </>


    )
}