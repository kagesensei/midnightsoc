import {copyFileSync, mkdirSync} from 'node:fs';

const root = new URL('../', import.meta.url);
mkdirSync(new URL('public/', root), {recursive: true});
copyFileSync(new URL('PLAYER_GUIDE.md', root), new URL('public/PLAYER_GUIDE.md', root));
