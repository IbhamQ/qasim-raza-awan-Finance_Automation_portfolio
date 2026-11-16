import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const directory=new URL('../finnovative/playground/',import.meta.url);
const read=name=>readFile(new URL(name,directory),'utf8');
const [html,rawCss,...modules]=await Promise.all([read('index.html'),read('styles.css'),read('guardrails.mjs'),read('core.mjs'),read('app.mjs')]);
// Remove complete import lines. Google Fonts URLs contain semicolons inside quotes.
const css=rawCss.replace(/^@import[^\r\n]*(?:\r?\n|$)/gm,'');
assert.match(css,/^:root\{/,'The embedded theme must remain intact.');
const script=modules.map(code=>code.replace(/^import [^\n]+\n/gm,'').replace(/\bexport /g,'')).join('\n');
const output=html.replace('<link rel="stylesheet" href="styles.css">',()=>'<style>'+css+'</style>')
 .replace('<script type="module" src="app.mjs"></script>',()=>'<script type="module">\n'+script+'\n</script>')
 .replaceAll('href="/finnovative/"','href="https://qasimawan-finnovative-automations.vercel.app/finnovative/"');
assert.doesNotMatch(output,/<link[^>]*rel="stylesheet"|<script[^>]*src=/);
await writeFile(new URL('Finnovative_Agent_Playground_Standalone.html',directory),output);
console.log('Built standalone HTML with embedded styles, scripts and synthetic data.');
