import { Template } from '@pdfme/common';
import axios from 'axios';
import siteConfig from '@generated/docusaurus.config';
import { useAPIKeyStore } from './pages/template-design';

// - - - - - - - - - - - - - - - - -
//      Templates Hooks
// - - - - - - - - - - - - - - - - -

export async function getTemplateByName(name: string): Promise<Template> {
  try {
    const response = await axios.get(`${siteConfig.customFields.BACKENDURL}${siteConfig.customFields.BACKENDPATH}/${name}`, {
      headers: {
        'x-api-key': `${useAPIKeyStore.getState().key}`,
      },
    });
    return JSON.parse(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
  }
}

export async function getTemplateList(): Promise<string[]> {
  try {
    const response = await axios.get(`${siteConfig.customFields.BACKENDURL}${siteConfig.customFields.BACKENDPATH}`, {
      headers: {
        'x-api-key': `${useAPIKeyStore.getState().key}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
    return [];
  }
}

export async function saveTemplateByName(fileName: string, fileContent: Template) {
  try {
    const { data } = await axios.post(
      `${siteConfig.customFields.BACKENDURL}${siteConfig.customFields.BACKENDPATH}`,
      {
        name: fileName,
        content: fileContent,
      },
      {
        headers: {
          'x-api-key': `${useAPIKeyStore.getState().key}`,
        },
      }
    );
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
    } else {
      console.log('unexpected error: ', error);
    }
  }
}
