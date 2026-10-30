import fs from 'fs';
import { spawn } from 'child_process';
import path from 'path';

let html = fs.readFileSync('./dist/index.html', 'utf8');
html = html.replace(/href="\/assets\//g, 'href="./assets/');
html = html.replace(/src="\/assets\//g, 'src="./assets/');
html = html.replace(/href="\/manifest.json"/g, 'href="./manifest.json"');
fs.writeFileSync('./dist/index-local.html', html);

const targetPath = path.resolve('test-file-screenshot-2.png');
const indexPath = path.resolve('./dist/index-local.html').replace(/\\/g, '/');
const userDataDir = path.resolve('./.chrome-temp');

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-web-security',
  '--allow-file-access-from-files',
  '--user-data-dir=' + userDataDir,
  '--virtual-time-budget=4000',
  '--screenshot=' + targetPath,
  '--window-size=1440,900',
  'file:///' + indexPath
]);

chrome.stderr.on('data', d => console.log('stderr:', d.toString()));
chrome.stdout.on('data', d => console.log('stdout:', d.toString()));

chrome.on('close', (code) => {
  console.log('Chrome finished with code:', code);
  console.log('Screenshot exists:', fs.existsSync(targetPath));
  if (fs.existsSync(targetPath)) {
    console.log('Size:', fs.statSync(targetPath).size);
    fs.unlinkSync(targetPath);
  }
  fs.unlinkSync('./dist/index-local.html');
  if (fs.existsSync(userDataDir)) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
});
