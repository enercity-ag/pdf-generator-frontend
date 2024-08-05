import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { SettingsOutlined } from '@mui/icons-material';
import ModalHead from './ModalHead';
import Divider from './Divider';
import { useForm } from 'react-hook-form';
import { useAPIKeyStore } from '../pages/template-design';

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

const SaveAPIKeyButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // - - - - - - - -

  const onSubmit = (values) => {
    useAPIKeyStore.setState(() => ({
      key: values.key,
    }));
    handleClose();
  };

  // - - - - - - - -

  type Inputs = {
    key: string;
  };

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<Inputs>();

  // - - - - - - - -

  return (
    <div>
      <button style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }} onClick={handleOpen} className="button button--sm button--outline button--success">
        <SettingsOutlined fontSize="small" style={{ marginRight: '0.25rem' }} />
        Set API Key
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
                <ModalHead title="Enter API-Key:" handleClose={handleClose} />
              </div>
              <Divider />
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="formInput">
                  <input
                    style={{ width: '50%' }}
                    placeholder={'loaded: ' + useAPIKeyStore.getState().key}
                    type="name"
                    {...register('key', {
                      required: 'Required',
                      pattern: /^[^.]+$/,
                    })}
                  />
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

export default SaveAPIKeyButton;
