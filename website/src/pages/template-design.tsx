import React, { useEffect, useRef, useState } from 'react';
import { ChangeCircleOutlined, PreviewOutlined, FileUploadOutlined } from '@mui/icons-material';
import type { Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { Designer } from '@pdfme/ui';
import { text, image, barcodes } from '@pdfme/schemas';
import Layout from '@theme/Layout';
import { getSampleTemplate, cloneDeep, downloadJsonFile, readFile, getGeneratorSampleCode, getDesignerSampleCode, getFormSampleCode, getViewerSampleCode } from '../libs/helper';
import HowToUseDesignerButton from '../components/HowToUseDesignerButton';
import DesignerCodeModal from '../components/DesignerCodeModal';
import LoadTemplateButton from '../components/loadTemplate';
import SaveTemplateButton from '../components/saveTemplate';
import { create } from 'zustand';

interface Name {
  name: string;
  updateName: (newName: string) => void;
}

export const useNameStore = create<Name>((set) => ({
  name: 'no saved template loaded',
  updateName: (newName) => set({ name: newName }),
}));

const headerHeight = 60;
const controllerHeight = 60;

const TemplateDesign = () => {
  const designerRef = useRef<HTMLDivElement | null>(null);
  const designer = useRef<Designer | null>(null);
  const [template, setTemplate] = useState<Template>(getSampleTemplate());
  const [smallDisplay, setSmallDisplay] = useState(true);
  const [prevDesignerRef, setPrevDesignerRef] = useState<Designer | null>(null);

  const [name, setName] = useState('');

  const modes = ['generator', 'designer', 'form', 'viewer'];

  const [codeMode, setCodeMode] = useState<(typeof modes)[number]>('generator');
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const handleCodeModalClose = () => setCodeModalOpen(false);

  const code = (() => {
    if (codeMode === 'generator') {
      return getGeneratorSampleCode(template);
    } else if (codeMode === 'designer') {
      return getDesignerSampleCode(template);
    } else if (codeMode === 'form') {
      return getFormSampleCode(template);
    } else if (codeMode === 'viewer') {
      return getViewerSampleCode(template);
    }
  })();

  useEffect(() => {
    setSmallDisplay(window.innerWidth < 900);
  }, []);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // base PDF
  const changeBasePdf = (file: File) => {
    if (designer.current) {
      readFile(file, 'dataURL').then(async (basePdf: string) => {
        designer.current.updateTemplate(Object.assign(cloneDeep(template), { basePdf }));
      });
    }
  };

  const changeTemplate = async (template_new: Template) => {
    if (designer.current) {
      await designer.current.updateTemplate(template_new);
    }
  };

  const getTemplate = () => {
    if (designer.current) {
      return designer.current.getTemplate();
    }
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const buildDesigner = () => {
    if (designerRef.current) {
      designer.current = new Designer({
        domContainer: designerRef.current,
        template,
        plugins: { text, image, qrcode: barcodes.qrcode },
      });
      designer.current.onChangeTemplate(setTemplate);
    }
  };

  const generatePdf = async () => {
    const inputs = template.sampledata ?? [];
    const pdf = await generate({
      template,
      plugins: { text, image, qrcode: barcodes.qrcode },
      inputs,
    });
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
  };

  if (designerRef.current && designerRef != prevDesignerRef) {
    if (prevDesignerRef && designer.current) {
      designer.current.destroy();
    }
    buildDesigner();
    setPrevDesignerRef(designerRef);
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return (
    <Layout title="Template Design">
      <div
        style={{
          height: controllerHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
        }}
      >
        <HowToUseDesignerButton />

        <div style={{ display: 'flex' }}>
          <label style={{ marginRight: '1rem', display: 'flex', alignItems: 'center' }} className="button button--sm button--outline button--success">
            <ChangeCircleOutlined fontSize="small" style={{ marginRight: '0.25rem' }} />
            Change BasePDF
            <input
              style={{ display: 'none' }}
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                if (e.target && e.target.files) {
                  changeBasePdf(e.target.files[0]);
                }
              }}
              onClick={(e) => {
                e.currentTarget.value = '';
              }}
            />
          </label>

          <LoadTemplateButton changeTemplate={changeTemplate} />

          <SaveTemplateButton getTemplate={getTemplate} />

          <button style={{ display: 'flex', alignItems: 'center' }} onClick={generatePdf} className="button button--sm button--outline button--secondary">
            <PreviewOutlined fontSize="small" style={{ marginRight: '0.25rem' }} />
            Preview PDF
          </button>
        </div>
      </div>
      <div ref={designerRef} style={{ width: '100%', height: `calc(100vh - ${headerHeight + controllerHeight}px)` }} />
      <DesignerCodeModal code={code} open={codeModalOpen} handleClose={handleCodeModalClose} codeMode={codeMode} modes={modes} setCodeMode={setCodeMode} />
    </Layout>
  );
};

export default TemplateDesign;
