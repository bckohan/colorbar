
class Colorbar {

  static cmaps = {}

  static findColorMap(name) {
      return Colorbar.cmaps[name];
  }

  static registerColorMap(name, data) {
      Colorbar.cmaps[name] = data;
  }

  static rgbToHex(rgb) {
    return '#' + rgb.map(
        x => {
          const hex = (Math.round(x)).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
      }
    ).join('');
  }

  constructor(cmap, range, options) {
    if (typeof cmap === 'string' || cmap instanceof String) {
      this.cmap = Colorbar.findColorMap(cmap);
    } else {
      this.cmap = cmap;
    }
    range = range || [0, 1];
    this.setRange(range[0], range[1]);
  }

  setRange(min, max) {
    this.min = min;
    this.max = max;
  }

  map(x) {
    if (x <= this.min) {
      return this.cmap[0];
    } else if ( x >= this.max) {
      return this.cmap[this.cmap.length-1];
    } else {
      let pos = (x-this.min)/(this.max-this.min);
      let low = Math.floor(pos);
      let diff = pos-low;
      let rgbLow = this.cmap[low];
      let rgbHigh = this.cmap[low+1]
      return [
          rgbLow[0] + diff*(rgbHigh[0] - rgbLow[0]),
          rgbLow[1] + diff*(rgbHigh[1] - rgbLow[1]),
          rgbLow[2] + diff*(rgbHigh[2] - rgbLow[2]),
      ];
    }
  }

  toMapBoxGL() {
    return [

    ];
  }

  svg(id, options) {
    options = options || {};
    let width = options.hasOwnProperty('width') ? options.width : 100;
    let height = options.hasOwnProperty('height') ? options.height : 10;
    let svg = this.makeSVG('svg', {
      id: id,
      width: width,
      height: height
    });
    let defs = this.makeSVG('defs');
    let linearGradient = this.makeSVG(
        'linearGradient', {
          x1: '0%',
          x2: '100%',
          y1: '0%',
          y2: '0%',
          id: `linear-gradient-${id}`
    });
    svg.appendChild(defs);
    defs.appendChild(linearGradient);

    let idx = 0;
    let start = 100/(2*this.cmap.length);
    this.cmap.forEach(rgb => {
      let stop = this.makeSVG('stop', {
        'offset': `${start+(idx/this.cmap.length)*100}%`,
        'stop-color': Colorbar.rgbToHex(rgb)
      });
      linearGradient.appendChild(stop);
      idx++;
    });

    let bar = this.makeSVG('rect', {
      'width': width,
      'height': height,
      'fill': `url(#linear-gradient-${id})`
    });
    svg.appendChild(bar);
    return svg;
  }

  makeSVG(tag, attrs) {
    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let k in attrs) {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  static selectDropdown(id, options) {
    options = options || {};
    let range = options.hasOwnProperty('range') ? options['range'] || [0, 1] : [0, 1];
    let cmaps = options.hasOwnProperty('cmaps') ? options['cmaps'] || Object.keys(Colorbar.cmaps) : Object.keys(Colorbar.cmaps);
    let cbOptions = options.hasOwnProperty('options') ? options['options'] || {} : {};
    let svgOptions = options.hasOwnProperty('svg') ? options['svg'] || {} : {};
    let div = document.createElement('div');
    div.className = 'colorbar-select-box';
    let input = document.createElement('input');
    div.appendChild(input);
    input.type = 'text';
    input.className = 'colorbar-select-input';
    input.value = cmaps[0];
    input.readOnly = true;
    input.placeholder = "Select Color Gradient";
    let ul = document.createElement('ul');
    ul.className = "colorbar-options-box hide";
    div.appendChild(ul);
    for (const cmap of cmaps) {
      let li = document.createElement('li');
      ul.appendChild(li);
      li.setAttribute('value', cmap);
      li.colorBar = new Colorbar(cmap, range, options);
      li.appendChild(li.colorBar.svg(`${id}-${cmap}-option`, svgOptions));
    }
    return div;
  }
}
