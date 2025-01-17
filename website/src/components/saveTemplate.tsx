import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { FileDownloadOutlined, Height, WidthFull } from '@mui/icons-material';
import ModalHead from './ModalHead';
import Divider from './Divider';
import { Template } from '@pdfme/common';
import { saveTemplateByName } from '../templateHooks';
import { useForm } from 'react-hook-form';
import { useNameStore } from '../pages/template-design';

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

type saveTemplateButtonProps = {
  getTemplate: () => Template;
};

const SaveTemplateButton = ({ getTemplate }: saveTemplateButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // - - - - - - - -

  const onSubmit = (values) => {
    const _name = String(values.name)
      .toLowerCase()
      .replace(' ', '_')
      .replace('ä', 'ae')
      .replace('ü', 'ue')
      .replace('ö', 'oe')
      .replace('ß', 'ss')
      .replace('-', '_')
      .replace('/', '_')
      .replace('\\', '_')
      .replace('.', '_')
      .replace(',', '_');

    saveTemplateByName(_name, getTemplate());
    handleClose();
  };

  type Inputs = {
    name: string;
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <div>
      <button style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }} onClick={handleOpen} className="button button--sm button--outline button--danger">
        <FileDownloadOutlined fontSize="small" style={{ marginRight: '0.25rem' }} />
        Save Template
      </button>
      <Modal open={open} onClose={handleClose}>
        <center>
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
                <ModalHead title="Enter Template Name:" handleClose={handleClose} />
              </div>
              <Divider />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formInput">
                  <input
                    style={{ width: '50%' }}
                    placeholder={'loaded: ' + useNameStore.getState().name}
                    type="name"
                    {...register('name', {
                      required: 'Required',
                      pattern: /^[^.]+$/,
                    })}
                  />
                  {errors.name && <p>Invalid Name (please check for special character and remove file extension)</p>}
                </div>
                <button style={{ width: '50%' }} type="submit">
                  Speichern
                </button>
              </form>
            </div>
          </Box>
        </center>
      </Modal>
    </div>
  );
};

export default SaveTemplateButton;
