import { Template } from '@pdfme/common';
import axios from 'axios';
import siteConfig from '@generated/docusaurus.config';

// - - - - - - - - - - - - - - - - -
//      Templates
// - - - - - - - - - - - - - - - - -

export async function getTemplateByName(name: string): Promise<Template> {
  try {
    const response = await axios.get(`${siteConfig.customFields.BACKENDURL}${siteConfig.customFields.BACKENDTEMPLATEURL}/${name}`, {
      headers: {
        'x-api-key': `${siteConfig.customFields.X_API_KEY}`,
      },
    });
    return JSON.parse(response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return;
    } else {
      console.log('unexpected error: ', error);
      return;
    }
  }
}

export async function getTemplateList(): Promise<string[]> {
  try {
    const response = await axios.get(`${siteConfig.customFields.BACKENDURL}${siteConfig.customFields.BACKENDTEMPLATEURL}`, {
      headers: {
        'x-api-key': `${siteConfig.customFields.X_API_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.log('error message: ', error.message);
      return [];
    } else {
      console.log('unexpected error: ', error);
      return [];
    }
  }
}

export async function saveTemplateByName(fileName: string, fileContent: Template) {
  const { data, status } = await axios.post(
    `http://localhost:3000/pdftemplating/v1/template`,
    {
      name: fileName,
      content: fileContent,
    },
    {
      headers: {
        'x-api-key': `${siteConfig.customFields.X_API_KEY}`,
      },
    }
  );
  return data;
}
