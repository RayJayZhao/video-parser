import axios from 'axios';

const COZE_API_KEY = 'pat_PJSKEpye7TiyR8fUXuuAMPc7aPQbiEoiW59uqRL1VZoVUpcwNlUbE1zBjb2eBGaU';
const COZE_API_URL = 'https://api.coze.cn/v1/workflow/run';

interface CozeResponse {
  code: number;
  data: string;
  msg: string;
  token: number;
}

export async function parseVideo(url: string): Promise<any> {
  try {
    const response = await axios.post<CozeResponse>(
      COZE_API_URL,
      {
        parameters: { input: url },
        workflow_id: '7485348921822216201'
      },
      {
        headers: {
          'Authorization': `Bearer ${COZE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      return JSON.parse(response.data.data).output;
    }
    throw new Error(response.data.msg);
  } catch (error: any) {
    throw new Error(`视频解析失败: ${error.message}`);
  }
}

export async function extractText(url: string): Promise<string> {
  try {
    const response = await axios.post<CozeResponse>(
      COZE_API_URL,
      {
        parameters: { input: url },
        workflow_id: '7485368399172239379'
      },
      {
        headers: {
          'Authorization': `Bearer ${COZE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      return JSON.parse(response.data.data).output;
    }
    throw new Error(response.data.msg);
  } catch (error: any) {
    throw new Error(`文案提取失败: ${error.message}`);
  }
}

export async function rewriteText(text: string): Promise<string> {
  try {
    const response = await axios.post<CozeResponse>(
      COZE_API_URL,
      {
        parameters: { input: text },
        workflow_id: '7485683247231205410'
      },
      {
        headers: {
          'Authorization': `Bearer ${COZE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      return JSON.parse(response.data.data).output;
    }
    throw new Error(response.data.msg);
  } catch (error: any) {
    throw new Error(`文案仿写失败: ${error.message}`);
  }
} 