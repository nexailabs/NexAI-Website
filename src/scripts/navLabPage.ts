import { initNavLabMenus } from './navLabMenus';

initNavLabMenus();
document.addEventListener('astro:page-load', () => initNavLabMenus());

