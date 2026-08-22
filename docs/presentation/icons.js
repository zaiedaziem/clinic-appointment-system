const React = require('react');
const ReactDOMServer = require('react-dom/server');
const sharp = require('sharp');
const fs = require('fs');
const {
  FaReact, FaLock, FaDatabase, FaChartBar, FaUserShield, FaUser,
  FaCalendarCheck, FaBan, FaSearch, FaBug, FaClipboardList, FaLayerGroup,
  FaCheckCircle, FaTimesCircle,
} = require('react-icons/fa');
const { SiSpring, SiMongodb } = require('react-icons/si');

const icons = {
  react: FaReact,
  spring: SiSpring,
  mongodb: SiMongodb,
  lock: FaLock,
  database: FaDatabase,
  chart: FaChartBar,
  admin: FaUserShield,
  user: FaUser,
  calendar: FaCalendarCheck,
  ban: FaBan,
  search: FaSearch,
  bug: FaBug,
  clipboard: FaClipboardList,
  layers: FaLayerGroup,
  check: FaCheckCircle,
  cross: FaTimesCircle,
};

async function main() {
  for (const [name, Icon] of Object.entries(icons)) {
    for (const [colorName, color] of Object.entries({ white: '#FFFFFF', dark: '#0B2027' })) {
      const svg = ReactDOMServer.renderToStaticMarkup(
        React.createElement(Icon, { size: 256, color })
      );
      const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">${svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</svg>`;
      await sharp(Buffer.from(fullSvg)).png().toFile(`${name}-${colorName}.png`);
    }
  }
  console.log('done');
}

main();
