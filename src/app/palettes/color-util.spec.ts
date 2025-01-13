import ColorUtil from './color-util';

describe('ColorUtil', () => {
  const hueToRgbMap = [
      {hue: 0, r:.5, g:1, b:0},
      {hue: 10, r:.6667, g:1, b:0},
      {hue: 20, r:.8333, g:1, b:0},
      {hue: 30, r:1, g:1, b:0},
      {hue: 40, r:1, g:.8333, b:0},
      {hue: 50, r:1, g:.6667, b:0},
      {hue: 60, r:1, g:.5, b:0},
      {hue: 70, r:1, g:.3333, b:0},
      {hue: 80, r:1, g:.1667, b:0},
      {hue: 90, r:1, g:0, b:0},
      {hue: 100, r:1, g:0, b:.1667},
      {hue: 110, r:1, g:0, b:.3333},
      {hue: 120, r:1, g:0, b:.5},
      {hue: 130, r:1, g:0, b:.6667},
      {hue: 140, r:1, g:0, b:.8333},
      {hue: 150, r:1, g:0, b:1},
      {hue: 160, r:.8333, g:0, b:1},
      {hue: 170, r:.6667, g:0, b:1},
      {hue: 180, r:.5, g:0, b:1},
      {hue: 190, r:.3333, g:0, b:1},
      {hue: 200, r:.1667, g:0, b:1},
      {hue: 210, r:0, g:0, b:1},
      {hue: 220, r:0, g:.1667, b:1},
      {hue: 230, r:0, g:.3333, b:1},
      {hue: 240, r:0, g:.5, b:1},
      {hue: 250, r:0, g:.6667, b:1},
      {hue: 260, r:0, g:.8333, b:1},
      {hue: 270, r:0, g:1, b:1},
      {hue: 280, r:0, g:1, b:.8333},
      {hue: 290, r:0, g:1, b:.6667},
      {hue: 300, r:0, g:1, b:.5},
      {hue: 310, r:0, g:1, b:.3333},
      {hue: 320, r:0, g:1, b:.1667},
      {hue: 330, r:0, g:1, b:0},
      {hue: 340, r:.1667, g:1, b:0},
      {hue: 350, r:.3333, g:1, b:0},
      {hue: 360, r:.5, g:1, b:0},
      {hue: 370, r:.6667, g:1, b:0},
    ];

  it('should create an instance', () => {
    expect(new ColorUtil()).toBeTruthy();
  });

  it('should gamma correctly', () => {
    expect(ColorUtil.gammaC(0)).toBeCloseTo(0);
    expect(ColorUtil.gammaC(.1)).toBeCloseTo(0.3492);
    expect(ColorUtil.gammaC(.2)).toBeCloseTo(0.4845);
    expect(ColorUtil.gammaC(.3)).toBeCloseTo(0.5838);
    expect(ColorUtil.gammaC(.4)).toBeCloseTo(0.6652);
    expect(ColorUtil.gammaC(.5)).toBeCloseTo(0.7354);
    expect(ColorUtil.gammaC(.6)).toBeCloseTo(0.7977);
    expect(ColorUtil.gammaC(.7)).toBeCloseTo(0.8543);
    expect(ColorUtil.gammaC(.8)).toBeCloseTo(0.9063);
    expect(ColorUtil.gammaC(.9)).toBeCloseTo(0.9547);
    expect(ColorUtil.gammaC(1)).toBeCloseTo(1);
  });

  it('should degamma correctly', () => {
    expect(ColorUtil.degamma(0)).toBeCloseTo(0);
    expect(ColorUtil.degamma(0.3492)).toBeCloseTo(0.1);
    expect(ColorUtil.degamma(0.4845)).toBeCloseTo(0.2);
    expect(ColorUtil.degamma(0.5838)).toBeCloseTo(0.3);
    expect(ColorUtil.degamma(0.6652)).toBeCloseTo(0.4);
    expect(ColorUtil.degamma(0.7354)).toBeCloseTo(0.5);
    expect(ColorUtil.degamma(0.7977)).toBeCloseTo(0.6);
    expect(ColorUtil.degamma(0.8543)).toBeCloseTo(0.7);
    expect(ColorUtil.degamma(0.9063)).toBeCloseTo(0.8);
    expect(ColorUtil.degamma(0.9547)).toBeCloseTo(0.9);
    expect(ColorUtil.degamma(1)).toBeCloseTo(1);
  });

  it('should convert to hex', () => {
    expect(ColorUtil.toHex({r:1, g:0, b:0})).toEqual('#ff0000');
    expect(ColorUtil.toHex({r:1, g:0, b:1})).toEqual('#ff00ff');
    expect(ColorUtil.toHex({r:0, g:1, b:1})).toEqual('#00ffff');
    expect(ColorUtil.toHex({r:.5, g:.7, b:.5})).toEqual('#80b380');
  });

  it('should saturate 100%', () => {
    let rgb = {r:.5, g:0, b:0};

    ColorUtil.saturate(rgb, 1);

    expect(rgb.r).toEqual(1);
    expect(rgb.g).toEqual(0);
    expect(rgb.b).toEqual(0);
  });

  it('should saturate 75%', () => {
    let rgb = {r:.5, g:0, b:0};

    ColorUtil.saturate(rgb, .75);

    expect(rgb.r).toEqual(1);
    expect(rgb.g).toEqual(.25);
    expect(rgb.b).toEqual(.25);
  });

  it('should convert hues to rgb', () => {
    for (let m of hueToRgbMap) {
      let rgb = ColorUtil.hueToRgb(m.hue);
      expect(rgb.r).toBeCloseTo(m.r);
      expect(rgb.g).toBeCloseTo(m.g);
      expect(rgb.b).toBeCloseTo(m.b);
    }
  });

  it('should convert rgb to hues', () => {
    for (let m of hueToRgbMap) {
      let hue = m.hue >= 360 ? m.hue - 360 : m.hue;
      expect(ColorUtil.rgbToHue(m.r, m.g, m.b)).toBeCloseTo(hue);
    }
  });

  it('should convert a saturated rgb to hue', () => {
    let rgb = ColorUtil.hueToRgb(270);
    ColorUtil.saturate(rgb, .5);
    ColorUtil.desaturate(rgb);
    expect(ColorUtil.rgbToHue(rgb.r, rgb.g, rgb.b)).toEqual(270);
  });
});
