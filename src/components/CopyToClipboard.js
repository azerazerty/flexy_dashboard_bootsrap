import React, { useState } from 'react'
// import { InputGroup, FormControl, Button, Tooltip, OverlayTrigger } from 'react-bootstrap'
import { useCopyToClipboard } from '@uidotdev/usehooks'
// import { Clipboard, Check2 } from 'react-bootstrap-icons'
import CIcon from '@coreui/icons-react'
import { cilClipboard, cilCheckAlt } from '@coreui/icons'

import { CTooltip, CInputGroup, CButton, CFormInput, CInputGroupText } from '@coreui/react-pro'

const CopyToClipboard = ({ text, ...rest }) => {
  const [copied, setCopied] = useState(false)
  const [, copyToClipboard] = useCopyToClipboard()

  // Tooltip rendering based on copy status
  const renderTooltip = (props) => (
    <CTooltip id="button-tooltip" {...props}>
      {copied ? 'Copied!' : 'Copy'}
    </CTooltip>
  )

  // Handle the copy action
  const handleCopy = () => {
    copyToClipboard(text)
    setCopied(true)

    // Reset the copy state after a short delay
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <CInputGroup {...rest}>
      {/* <CFormInput readOnly value={text} className="text-truncate" aria-label="Copy input text" /> */}
      <CFormInput
        style={{ width: 'fit-content' || 100 }}
        readOnly
        // placeholder="Recipient's username"
        value={text || 'Invalid Api Key'}
        aria-label="Recipient's username"
        aria-describedby="basic-addon2"
      />
      <CTooltip placement="top" content={copied ? 'Copied!' : 'Copy'}>
        {/* <CButton
          variant="outline-secondary"
          onClick={handleCopy}
          className="d-flex align-items-center"
        >
          // {copied ? <Check2 size={18} /> : <Clipboard size={18} />} //
          {copied ? (
            <CIcon icon={cilCheckAlt} size={18} />
          ) : (
            <CIcon icon={cilClipboard} size={18} />
          )}

          <span className="ms-2">{copied ? 'Copied' : 'Copy'}</span>
        </CButton> */}
        <CInputGroupText style={{ cursor: 'pointer' }} onClick={handleCopy} id="basic-addon2">
          {copied ? (
            <CIcon icon={cilCheckAlt} size="sm" />
          ) : (
            <CIcon icon={cilClipboard} size="sm" />
          )}
        </CInputGroupText>
      </CTooltip>
    </CInputGroup>
  )
}

export default CopyToClipboard
