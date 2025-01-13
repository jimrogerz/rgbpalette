import { ColorLoader } from './color-loader';
import { ColorConfig, Distribution } from '../../proto/color_config';

describe('ColorLoader', () => {
  it('should create an instance', () => {
    expect(new ColorLoader()).toBeTruthy();
  });

  it('should load red', () => {
    const hs = ColorLoader.getHS("red");

    expect(hs).not.toEqual(null);
    expect(hs!.hue).toBeCloseTo(90);
    expect(hs!.saturation).toBeCloseTo(1);
  });

  it('should load red hex', () => {
    const hs = ColorLoader.getHS("#ff0000");

    expect(hs).not.toEqual(null);
    expect(hs!.hue).toBeCloseTo(90);
    expect(hs!.saturation).toBeCloseTo(1);
  });

  it('should load red hex2', () => {
    const hs = ColorLoader.getHS("ff0000");

    expect(hs).not.toEqual(null);
    expect(hs!.hue).toBeCloseTo(90);
    expect(hs!.saturation).toBeCloseTo(1);
  });

  it('should serialize ColorConfig', () => {
    let colorConfig = new ColorConfig();
    colorConfig.hue_count = 134;
    colorConfig.distribution = Distribution.DISTRIBUTION_NEAR;
    colorConfig.proximity = 111;
    colorConfig.hue_offset = .5;
    colorConfig.saturation = .5;
    colorConfig.scale_min = 107;
    colorConfig.scale_max = 117;
    colorConfig.scale_step = 59;
    const serialized = ColorLoader.serializeConfig(colorConfig);

    expect(serialized).toEqual("hoDvgA19ew--");
  });

  it('should deserialize above color hoDvgA19ew--', () => {
    const deserialized = ColorLoader.deserializeConfig("hoDvgA19ew--");

    expect(deserialized.hue_count).toEqual(134);
    expect(deserialized.distribution).toEqual(Distribution.DISTRIBUTION_NEAR);
    expect(deserialized.proximity).toEqual(111);
    expect(deserialized.hue_offset).toBeCloseTo(.5);
    expect(deserialized.saturation).toBeCloseTo(.5);
    expect(deserialized.scale_min).toEqual(107);
    expect(deserialized.scale_max).toEqual(117);
    expect(deserialized.scale_step).toEqual(59);
  });

  it('should deserialize orange=Af.eL_FXyg--', () => {
    const deserialized = ColorLoader.deserializeConfig("Af.eL_FXyg--");

    expect(deserialized.hue_count).toEqual(1);
    expect(deserialized.distribution).toEqual(Distribution.DISTRIBUTION_NEAR);
    expect(deserialized.proximity).toEqual(30);
    expect(deserialized.hue_offset).toBeCloseTo(0.1873015873015873);
    expect(deserialized.saturation).toBeCloseTo(1);
    expect(deserialized.scale_min).toEqual(10);
    expect(deserialized.scale_max).toEqual(95);
    expect(deserialized.scale_step).toEqual(10);
  });
});
