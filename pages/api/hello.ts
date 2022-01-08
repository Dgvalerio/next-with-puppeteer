// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer/lib/cjs/puppeteer/node-puppeteer-core';

type Data = { pais: string; capital: string; continente: string }[]

const handler  = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
)  => {
  let countries: { pais: string; capital: string; continente: string }[] = [];
  const baseUrl = 'https://www.sport-histoire.fr/pt/Geografia/Paises_por_ordem_alfabetica.php';

  try {
    console.log('Init puppeteer');

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(baseUrl);

    console.log(`Navigate to "${baseUrl}"`);

    await page.waitForSelector('h1');

    countries = await page.evaluate(() => {
      const items: { pais: string; capital: string; continente: string }[] = [];

      document.querySelectorAll('tr').forEach(({ children }) =>
        items.push({
          pais: (children[0] as HTMLTableColElement)?.innerText,
          capital: (children[1] as HTMLTableColElement)?.innerText,
          continente: (children[2] as HTMLTableColElement)?.innerText,
        })
      );

      return items;
    });

    await page.close();

    res.status(200).json(countries);
  } catch (e) {
    console.log({ e });
    // @ts-ignore
    res.status(500).json({ error: e });
  }
}

export default handler;
