#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const DEFAULT_TARGET = 'data/crops.js';
const DEFAULT_FIELDS = ['cn', 'tips', 'vars'];

function parseArgs(argv) {
  const args = { source: '', target: DEFAULT_TARGET, dryRun: false, addMissing: false, fields: [...DEFAULT_FIELDS] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source' || a === '-s') args.source = argv[++i] || '';
    else if (a === '--target' || a === '-t') args.target = argv[++i] || DEFAULT_TARGET;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--add-missing') args.addMissing = true;
    else if (a === '--fields') {
      const raw = argv[++i] || '';
      const parts = raw.split(',').map(s => s.trim()).filter(Boolean);
      if (parts.length) args.fields = parts;
    } else if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown arg: ${a}`);
    }
  }
  if (!args.source) throw new Error('Missing --source <path to updated planting-calendar html>');
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/import-varieties-from-html.mjs --source "varieties/planting-calendar (1).html" [options]

Options:
  --dry-run            Show what would change without writing
  --add-missing        Append crops found in source but missing in target V
  --fields cn,tips,vars  Fields to merge from source into matching crop rows
  --target data/crops.js  Target data file (default: ${DEFAULT_TARGET})
`);
}

function findConstRange(src, name) {
  const token = `const ${name}=`;
  const start = src.indexOf(token);
  if (start < 0) throw new Error(`Could not find "${token}"`);
  let i = start + token.length;
  while (i < src.length && /\s/.test(src[i])) i++;
  const open = src[i];
  const close = open === '[' ? ']' : open === '{' ? '}' : null;
  if (!close) throw new Error(`Unsupported expression start for ${name}: ${JSON.stringify(open)}`);
  let depth = 0;
  let quote = null;
  let escape = false;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        let j = i + 1;
        while (j < src.length && /\s/.test(src[j])) j++;
        if (src[j] === ';') j++;
        return { start, end: j };
      }
    }
  }
  throw new Error(`Unclosed ${name}`);
}

function evaluateConstBlock(code, names) {
  const wrapped = `${code}\n;({${names.join(',')}})`;
  return vm.runInNewContext(wrapped, {}, { timeout: 2000 });
}

function extractVFromHtml(htmlText) {
  const range = findConstRange(htmlText, 'V');
  const block = htmlText.slice(range.start, range.end);
  const { V } = evaluateConstBlock(block, ['V']);
  if (!Array.isArray(V)) throw new Error('Source V is not an array');
  return V;
}

function loadTargetData(targetPath) {
  const text = fs.readFileSync(targetPath, 'utf8');
  const vRange = findConstRange(text, 'V');
  const metaRanges = [
    findConstRange(text, 'CATEGORY_SCHEMA_DEFAULTS'),
    findConstRange(text, 'CROP_SCHEMA_OVERRIDES')
  ];
  const extracted = evaluateConstBlock(
    [text.slice(vRange.start, vRange.end), ...metaRanges.map(r => text.slice(r.start, r.end))].join('\n'),
    ['V', 'CATEGORY_SCHEMA_DEFAULTS', 'CROP_SCHEMA_OVERRIDES']
  );
  if (!Array.isArray(extracted.V)) throw new Error('Target V is not an array');
  return { text, vRange, data: extracted };
}

function clone(v) {
  return v == null ? v : JSON.parse(JSON.stringify(v));
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function cropKey(c) {
  return `${String(c?.cat || '').trim()}::${String(c?.name || '').trim()}`;
}

function mergeVarietyUpdates(targetRows, sourceRows, fields, addMissing) {
  const target = targetRows.map(clone);
  const sourceByKey = new Map(sourceRows.map(row => [cropKey(row), row]));
  const changes = [];
  let matchCount = 0;

  for (let i = 0; i < target.length; i++) {
    const t = target[i];
    const src = sourceByKey.get(cropKey(t));
    if (!src) continue;
    matchCount++;
    const changedFields = [];
    for (const field of fields) {
      if (!Object.prototype.hasOwnProperty.call(src, field)) continue;
      if (!deepEqual(t[field], src[field])) {
        t[field] = clone(src[field]);
        changedFields.push(field);
      }
    }
    if (changedFields.length) changes.push({ crop: t.name, category: t.cat, fields: changedFields });
  }

  let added = 0;
  if (addMissing) {
    const targetKeys = new Set(target.map(cropKey));
    for (const s of sourceRows) {
      if (targetKeys.has(cropKey(s))) continue;
      target.push(clone(s));
      targetKeys.add(cropKey(s));
      added++;
      changes.push({ crop: s.name, category: s.cat, fields: ['<added crop>'] });
    }
  }
  return { merged: target, changes, added, matchCount };
}

function replaceVBlock(targetText, vRange, nextV) {
  const eol = targetText.includes('\r\n') ? '\r\n' : '\n';
  const vCode = `const V=${JSON.stringify(nextV, null, 2)};`.replace(/\n/g, eol);
  return targetText.slice(0, vRange.start) + vCode + targetText.slice(vRange.end);
}

function summarize(changes) {
  if (!changes.length) return 'No matching crop variety/tip changes detected.';
  const lines = changes.map(c => `- ${c.crop} [${c.category}]: ${c.fields.join(', ')}`);
  return `${changes.length} crop entries changed:${'\n'}${lines.join('\n')}`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourcePath = path.resolve(args.source);
  const targetPath = path.resolve(args.target);
  if (!fs.existsSync(sourcePath)) throw new Error(`Source file not found: ${sourcePath}`);
  if (!fs.existsSync(targetPath)) throw new Error(`Target file not found: ${targetPath}`);

  const sourceHtml = fs.readFileSync(sourcePath, 'utf8');
  const sourceV = extractVFromHtml(sourceHtml);
  const target = loadTargetData(targetPath);
  const result = mergeVarietyUpdates(target.data.V, sourceV, args.fields, args.addMissing);

  console.log(`Source crops: ${sourceV.length}`);
  console.log(`Target crops: ${target.data.V.length}`);
  console.log(`Matched crops: ${result.matchCount}`);
  console.log(summarize(result.changes));

  if (args.dryRun) {
    console.log('Dry run only; no files written.');
    return;
  }
  if (!result.changes.length) {
    console.log('Nothing to write.');
    return;
  }
  const nextText = replaceVBlock(target.text, target.vRange, result.merged);
  fs.writeFileSync(targetPath, nextText, 'utf8');
  console.log(`Updated ${path.relative(process.cwd(), targetPath)}`);
}

try {
  main();
} catch (err) {
  console.error(`Error: ${err?.message || err}`);
  process.exit(1);
}

