import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FileDownloadOutlined, LegendToggleRounded } from '@mui/icons-material';
import ModalHead from './ModalHead';
import Divider from './Divider';
import { getTemplateList, getTemplateByName } from '../templateHooks';
import { Template } from '@pdfme/common';

const modalBoxStyle = {
  position: 'absolute',
  minWidth: '70%',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1px solid #eee',
  borderRadius: 1,
  boxShadow: 24,
};

type LoadTemplateButtonProps = {
  changeTemplate: (template: Template) => void;
};

const LoadTemplateButton = ({ changeTemplate }: LoadTemplateButtonProps) => {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState([]);

  const handleOpen = () => {
    setOpen(true);
    loadTemplates();
  };
  const handleClose = () => setOpen(false);

  const loadTemplates = async () => {
    const templateList = await getTemplateList();
    setTemplates(templateList);
  };

  // load Template
  const loadTemplateByName = async (name: string) => {
    const loadedTemplate = (await getTemplateByName(name)) as Template;
    changeTemplate(loadedTemplate);
    handleClose();
  };

  return (
    <div>
      <button style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }} onClick={handleOpen} className="button button--sm button--outline button--warning">
        <FileDownloadOutlined fontSize="small" style={{ marginRight: '0.25rem' }} />
        Load Template
      </button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalBoxStyle}>
          <div
            style={{
              maxWidth: '100vw',
              maxHeight: '100vh',
              overflow: 'auto',
              padding: '1rem',
              backgroundColor: 'var(--ifm-navbar-background-color)',
            }}
          >
            <div>
              <ModalHead title="Choose Template:" handleClose={handleClose} />
            </div>
            <Divider />
            <div>
              {templates.map((name) => (
                <button
                  key={name}
                  style={{ marginRight: '1rem', marginBottom: '1rem', fontSize: 'medium' }}
                  onClick={() => loadTemplateByName(name)}
                  className="button button--sm button--outline button--success"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default LoadTemplateButton;
