import { Request, Response } from 'express';

export const proxy = async (req: Request, res: Response) => {
  const url = req.originalUrl.replace('/api/proxy/', '');
  const { method } = req;
  try {
    if (!url) {
      console.log('No url');
      return res.status(404).json({ message: 'Url not found' });
    }
    let response;

    switch (method) {
      case 'GET': {
        response = await fetch(addApiKeyToUrl(url), { method: 'GET' });
        break;
      }
      case 'POST': {
        response = await fetch(addApiKeyToUrl(url), { method: 'POST' });
        break;
      }
      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// this way we avoid leaking secrets to client side
const addApiKeyToUrl = (url: string): string => {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  switch (domain) {
    case 'api.themoviedb.org': {
      const apiKey = process.env.TMDB_API_KEY;
      if (apiKey) {
        urlObj.searchParams.append('api_key', apiKey);
      } else {
        throw new Error('TMDB_API_KEY is not defined');
      }
      break;
    }
    default:
      break;
  }
  const result = urlObj.toString();
  console.log(result);
  return result;
};
