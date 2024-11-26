export default function PSIAlert({ propMessage, propMessageType, onClickCloseAlert }) {
    const itsDisplay = propMessage.length === 0 ? 'alert alert-' + propMessageType + ' alert-dismissible fade hide' :
        'alert alert-' + propMessageType + ' alert-dismissible fade show'

    return (
        <>
            <div className={itsDisplay} role="alert">
                {propMessage}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={onClickCloseAlert}></button>
            </div>
        </>
    )
}