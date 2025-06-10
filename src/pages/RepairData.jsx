import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import '../home.css'
import { Badge, Container } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFileExcel } from "@fortawesome/free-regular-svg-icons"
import { saveAs } from "file-saver"
import { useRef } from "react"

export default function RepairData({ userInfo }) {
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

        setIsSearching(true)
        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/repair/trace-paginate?' + params + '&page=' + thePage, config)
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

    function handleClickExport(fileType) {
        const params = new URLSearchParams(formData).toString()
        setIsExporting(true)
        if (confirm('Are you sure want to export the data ?')) {
            axios({
                url: import.meta.env.VITE_APP_ENDPOINT + '/repair/trace-to-spreadsheet?' + params + '&file_type=' + fileType,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                setIsExporting(false)
                saveAs(response.data, 'Repair data Logs ' + Date.now() + ' .' + fileType)
            }).catch(error => {
                setIsExporting(false)
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
                            <button type="button" className="btn btn-success" title="Export to spreadsheet file" onClick={() => handleClickExport('xlsx')} disabled={isExporting}><FontAwesomeIcon icon={faFileExcel} /></button>
                            <button type="button" className="btn btn-outline-success" title="Export to CSV file" onClick={() => handleClickExport('csv')} disabled={isExporting}>CSV</button>
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
                                    <th className="align-middle">Date</th>
                                    <th className="align-middle">Line</th>
                                    <th className="align-middle">Model</th>
                                    <th className="align-middle">Assy No</th>
                                    <th className="align-middle">Type</th>
                                    <th className="align-middle">NG Station</th>
                                    <th className="align-middle">PCB Serial</th>
                                    <th className="align-middle">PCB Number</th>
                                    <th className="align-middle">JM Barcode</th>
                                    <th className="align-middle">Phenomenon</th>
                                    <th className="align-middle">Defect</th>
                                    <th className="align-middle">Loc1</th>
                                    <th className="align-middle">Loc2</th>
                                    <th className="align-middle">Loc3</th>
                                    <th className="align-middle">Loc4</th>
                                    <th className="align-middle">Loc5</th>
                                    <th className="align-middle">WEEK</th>
                                    <th className="align-middle">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    isSearching ? <tr><td colSpan={16}>Please wait</td></tr> : rowData.data.map((item, index) => {
                                        return <tr key={index} className="font-monospace">
                                            <td>{item.Repair_date}</td>
                                            <td>{item.Repair_line}</td>
                                            <td>{item.PdtNo}</td>
                                            <td>{item.AssyNo}</td>
                                            <td>{item.BoardNo}</td>
                                            <td>{item.Repair_NGStsn}</td>
                                            <td>{item.Repair_PCBSrl}</td>
                                            <td>{item.Repair_PCBNo}</td>
                                            <td>{item.Repair_JMCode}</td>
                                            <td>{item.Repair_pnmn}</td>
                                            <td>{item.Repair_defect}</td>
                                            <td>{item.Repair_Loc1}</td>
                                            <td>{item.Repair_loc2}</td>
                                            <td>{item.Repair_loc3}</td>
                                            <td>{item.Repair_loc4}</td>
                                            <td>{item.Repair_loc5}</td>
                                            <td>{item.Repair_week}</td>
                                            <td>{item.Repair_cat}</td>
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
    )
}