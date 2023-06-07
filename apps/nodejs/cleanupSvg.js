import { SVG, cleanupSVG } from '@iconify/tools';
import clipboard from 'clipboardy';


const reallyBadIcon = ``;// put SVG here

const svg = new SVG(reallyBadIcon);
cleanupSVG(svg);

console.log(svg.toMinifiedString());

clipboard.write(svg.toMinifiedString()).then(() => {
   console.info('========> copied new svg to clipboard')
})